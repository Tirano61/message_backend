// scripts/sync-conversation.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Conversation } from '../src/conversation/entities/conversation.entity';
import { User } from '../src/auth/entities/user.entity';
import { Message } from '../src/message/entities/message.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
	const ds = new DataSource({
		type: 'postgres',
		host: process.env.DB_HOST,
		port: +(process.env.BD_PORT ?? 5432),
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB_NAME,
		entities: [Conversation, User, Message],
		synchronize: true, // solo para esta conexión temporal
		logging: true,
	});

	try {
		await ds.initialize();
		console.log('Sync completed for Conversation entity');
	} catch (err) {
		console.error('Error syncing:', err);
	} finally {
		await ds.destroy();
	}
}

main();

/// Comando para ejecutar el script y agregar las columnas a la tabla

/// npx ts-node -r tsconfig-paths/register scripts/sync-conversation.ts