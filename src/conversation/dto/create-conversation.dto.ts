import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {

    @IsUUID()
    @IsNotEmpty()
    user: string;

    @IsOptional()
    @IsString()
    title?: string;

}
