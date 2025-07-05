import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

  // Si necesitas el userId explícitamente (por ejemplo, para pruebas)
    @IsUUID()
    @IsNotEmpty()
    userId: string;

}
