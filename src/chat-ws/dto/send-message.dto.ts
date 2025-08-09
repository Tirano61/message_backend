import { IsString, IsNotEmpty, IsUUID, IsOptional, IsIn } from 'class-validator';

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsOptional()
    type?: string = 'text';

    @IsIn(['user', 'bot'])
    @IsNotEmpty()
    sender: 'user' | 'bot';
}