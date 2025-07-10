import { IsString } from "class-validator";

export class CreateComponentDto {

    @IsString()
    name: string;

    @IsString()
    description?: string;

    @IsString()
    categoryId: string;
    
}
