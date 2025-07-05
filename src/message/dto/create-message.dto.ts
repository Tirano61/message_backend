import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsEnum(['user', 'system'])
    @IsNotEmpty()
    sender: 'user' | 'system';

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    type?: string = 'text';
}
