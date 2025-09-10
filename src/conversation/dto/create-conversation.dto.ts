import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {

	@IsOptional()
	@IsUUID()
	user?: string;

	@IsOptional()
	@IsString()
	title?: string;

	@IsEnum(['sales', 'tecnico', 'anonimo'])
	type: string;

}
