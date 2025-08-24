# chat-ws Gateway

Descripción y flujo planeado del WebSocket gateway `ChatWsGateway`.

## Resumen

`ChatWsGateway` es un gateway de Socket.IO usado para manejar conexiones de chat en tiempo real. Soporta dos flujos principales de clientes:

- Clientes autenticados (usuarios con JWT)
- Clientes anónimos asociados a una `conversationId` + `session_token`

Además, el gateway crea mensajes a través del servicio `MessageService` y notifica a un webhook externo (n8n) para procesamiento asíncrono.

## Autenticación y handshake

1. Al conectarse, el servidor intenta leer un JWT desde `client.handshake.auth.token`.
   - Si el token es válido, se decodifica con `JwtService` y se guarda la información del usuario en `client.data.user`.
   - Se llama a `chatWsService.registerClient(client)` para registrar el socket.

2. Si no hay token o es inválido, el gateway acepta clientes anónimos sólo si proporcionan en el handshake (`auth`):
   - `conversationId` (string)
   - `session_token` (string)

   El servidor valida la `conversationId` y `session_token` consultando `ConversationService.findOneById`.
   Si la validación falla se desconecta el cliente.

3. Para clientes anónimos válidos, se almacenan en `client.data`:
   - `user = null`
   - `conversationId`
   - `session_token`

## Eventos expuestos (SubscribeMessage)

- `client-send-message` (principal)
  - Soporta tanto usuarios autenticados como anónimos.
  - Flujo:
    1. Determina si `client.data.user` existe (autenticado) o no (anónimo).
    2. Para autenticados: sólo valida que la conversación exista.
    3. Para anónimos: valida `conversationId` y que el `session_token` coincida.
    4. Crea el mensaje usando `MessageService.create(...)` con `sender: 'user'`.
    5. Emite `message-saved` al cliente con el mensaje guardado.
    6. Notifica a `process.env.N8N_WEBHOOK_URL` (si está configurada) con payload JSON que incluye `messageId`, `conversationId`, `socketId`, `session_token`, `content` y `sender`.

- `client-send-user` (deprecated)
  - Llama internamente a `client-send-message` para compatibilidad.

- `client-send-tecnico` (esqueleto)
  - Pensado para mensajes que requieren autenticación y roles (por ejemplo técnicos/operadores).
  - Actualmente valida la presencia de `client.data.user` y debe ampliarse para verificar roles.

## Manejo de desconexión

- `handleDisconnect(client)` desregistra el cliente y hace log de la desconexión.

## Cambios planeados y recomendaciones

1. Validaciones y errores:
   - Homogeneizar respuestas de error con eventos y códigos estandarizados (ej. `error`, `validation-error`).
   - Evitar mostrar en logs datos sensibles (tokens) y usar logs estructurados.

2. Retries y resiliencia para el webhook n8n:
   - Actualmente se hace `fetch` sin retry. Implementar una cola o reintentos exponiendo fallos en un sistema de métricas.
   - Validar que `process.env.N8N_WEBHOOK_URL` esté presente antes de intentar notificar.

3. Manejo de sockets duplicados:
   - `chatWsService.registerClient` debería manejar reconexiones y evitar múltiples registros duplicados para la misma conversación/session.

4. Roles y permisos:
   - Implementar comprobación de `header.roles` en `client-send-tecnico` para permitir sólo técnicos.

5. Tests y documentación:
   - Añadir pruebas unitarias/mocks para `ChatWsGateway` usando `@nestjs/testing` y `socket.io` mocks.
   - Documentar el handshake en la doc de la API (ejemplos con socket.io-client y headers/auth) — ver ejemplos abajo.

## Ejemplos de conexión (cliente)

Decisión unificada: enviar el JWT en el handshake usando `auth` (por ejemplo `auth: { token: '<JWT>' }`) para clientes web y móviles (Flutter). Esto simplifica el servidor (valida una vez en la conexión) y evita problemas de CORS con cabeceras en navegadores.

- Cliente web (recomendado):

```js
// socket.io (browser)
const socket = io("https://example", {
   auth: { token: "<JWT_TOKEN>" }
});
```

- Cliente Flutter (recomendado si usas socket_io_client):

```dart
// Dart / Flutter (socket_io_client)
import 'package:socket_io_client/socket_io_client.dart' as IO;

final socket = IO.io('https://example', IO.OptionBuilder()
   .setAuth({'token': '<JWT_TOKEN>'})
   .build());

socket.connect();
```


-- Cliente anónimo (handshake auth):

```js
const socket = io("https://example", {
   auth: { conversationId: "abc", session_token: "xyz" }
});
```

## Notas finales

Este README resume el comportamiento actual implementado en `ChatWsGateway` y propone mejoras que deberíamos priorizar en próximas tareas (retries webhook, roles, tests, y limpieza de logs).

## Dónde enviar `conversationId` y `session_token`

Recomendación general: enviar `conversationId` y `session_token` durante el handshake de la conexión WebSocket (es decir, en `auth` o en headers), no en el body de cada mensaje. Motivos y patrones:

- Handshake (recomendado):
   - Ventaja: permite al servidor validar y asociar la sesión al socket en el momento de la conexión y luego confiar en `client.data` para mensajes posteriores sin reenviar credenciales.
   - Cómo: usar `auth` con socket.io.
   - Ejemplo (socket.io `auth`):

      ```js
      const socket = io("https://example", {
         auth: { conversationId: "abc", session_token: "xyz" }
      });
      ```

      - Nota: usar exclusivamente `auth` en el handshake para web y móvil.

- Body de cada mensaje (no recomendado):
   - Riesgos: enviar `session_token` repetidamente en el body incrementa la superficie de ataque (fuga de token en logs, middlewares, o reproyección a sistemas externos). También es redundante si el socket ya está autenticado.
   - Uso aceptable: incluir `conversationId` en el payload cuando el cliente necesita indicar explícitamente a qué conversación se refiere y el servidor no tiene ese contexto; pero evitar enviar `session_token` en cada payload.

- Flujo seguro sugerido:
   1. Cliente envía `conversationId` + `session_token` en el handshake.
   2. Servidor valida y guarda en `client.data` (`conversationId`, `session_token` o solo un marcador validado).
   3. Mensajes posteriores no necesitan `session_token`; sólo pueden enviar `conversationId` si el cliente maneja múltiples conversaciones en la misma conexión.

- Para el webhook (n8n) y sistemas externos:
   - Nunca reenviar `session_token` sin necesidad. Si necesitas pasar una referencia a un sistema externo, considera pasar sólo `conversationId` y, si es imprescindible, un token de un solo uso o un identificador firmado creado por el servidor.
   - Validar que `process.env.N8N_WEBHOOK_URL` esté configurada y que la llamada se haga por HTTPS.

   ## Cómo manejar el token en el servidor

   El servidor acepta exclusivamente el token enviado en `client.handshake.auth.token`. El gateway debe leer `auth.token`, verificarlo con `JwtService` y, si es válido, guardar la info en `client.data.user`.

   Ejemplo (fragmento TypeScript en el gateway):

   ```ts
   const token = (client.handshake as any).auth?.token as string | undefined;
   if (token) {
      try {
         const payload = this.swtService.verify(token) as JWTPayloadInterface;
         client.data.user = payload;
         // registrar cliente...
      } catch (err) {
         // token inválido -> continuar como anónimo o desconectar según política
      }
   }
   ```

## Seguridad y buenas prácticas (resumen)

- Usar TLS para todas las conexiones (ws -> wss / HTTPS).
- No loguear tokens en texto plano.
- Hacer tokens cortos y/o rotativos; si el `session_token` es sensible, mantenerlo sólo en el servidor luego de validarlo.
- Implementar límites de tasa y detección de anomalías por `conversationId` o IP.

