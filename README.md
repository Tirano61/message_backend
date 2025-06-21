<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo


1. Colonar el repo

2. Ejecutar 
```
  npm install
```

3. Tener Nest CLI instalado
```
nm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```
### Packages
 * Configurar las variables de entorno
    ```
    pm i @nestjs/config
    app.module.ts  ConfigModule.forRoot(),
    ```
 * Base de datos
    ```
    npm install --save @nestjs/typeorm typeorm pg
    app.module.ts
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.BD_PORT ?? 5432), 
      database: process.env.POSTGRES_DB_NAME,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // generalmente se usa en true en desarrollo, en produccionse hace una migracion
    }),
    ```







