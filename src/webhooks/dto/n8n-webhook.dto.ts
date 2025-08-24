import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class N8nWebhookDto {
	@IsString()
	@IsNotEmpty()
	conversationId: string;

	@IsString()
	@IsNotEmpty()
	content: string;

	@IsIn(['user', 'bot'])
	@IsOptional()
	sender?: 'user' | 'bot';

	@IsString()
	@IsOptional()
	socketId?: string;

	// any other metadata fields can be optional
	@IsOptional()
	metadata?: any;
}
