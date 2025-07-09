import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([ Message ]),PassportModule.register({ defaultStrategy: 'jwt' }) ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [ TypeOrmModule, MessageService ]
})
export class MessageModule {}

