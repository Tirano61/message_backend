import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsEnum(['open', 'close'])
    @IsNotEmpty()
    status: string;

    messages?: string[];

}
