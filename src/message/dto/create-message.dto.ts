import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
    
    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsEnum(['user', 'bot'])
    @IsNotEmpty()
    sender: 'user' | 'bot';

    @IsString()
    @IsNotEmpty()
    content: string;

}
