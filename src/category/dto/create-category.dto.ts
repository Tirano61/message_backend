import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Component } from "src/component/entities/component.entity";

export class CategoryDto {    

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsOptional()
    components?: Component[]; // Si usas la entidad Component, cambia el tipo

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsNotEmpty()
    type: 'user' | 'tecnico';
}
