import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { ChatWsModule } from './chat-ws/chat-ws.module';
import { CategoryModule } from './category/category.module';




@Module({
  imports: [
    ConfigModule.forRoot(),
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
    AuthModule,
    MessageModule,
    ConversationModule,
    ChatWsModule,
    CategoryModule,
    
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
