import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { SalesMaterialsModule } from './sales_materials/sales_materials.module';
import { MaterialUsageModule } from './material_usage/material_usage.module';
import { SalesAgentLogModule } from './sales_agent_log/sales_agent_log.module';
import { WebhooksModule } from './webhooks/webhooks.module';



@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +(process.env.BD_PORT ?? 5433),
			database: process.env.POSTGRES_DB_NAME,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			autoLoadEntities: true,
			synchronize: false, // importante: no permitir que TypeORM altere esquema con tipos no reconocidos
			extra: {}
		}),
		AuthModule,
		MessageModule,
		ConversationModule,
		ChatWsModule,
		SalesMaterialsModule,
		MaterialUsageModule,
		SalesAgentLogModule,
		WebhooksModule,

	],
	controllers: [],
	providers: [],
})
export class AppModule { }
