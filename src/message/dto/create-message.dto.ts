import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsEnum(['user', 'tecnico'])
    @IsNotEmpty()
    sender: 'user' | 'tecnico';

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    type?: string = 'text';
}
