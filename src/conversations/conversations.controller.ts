import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateConversationDto } from 'src/auth/dtos/CreateConversation.dto';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decoratiors';
import { User } from 'src/utils/typeorm';
import { IConversationsService } from './conversations';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
	constructor( 
		@Inject(Services.CONVERSATIONS)
		private readonly conversationsService: IConversationsService,
		){}

	@Post()
	async createConversation(
		@AuthUser() user: User,
		@Body() createConversationPayload: CreateConversationDto) {
		return this.conversationsService.createConversation(user, createConversationPayload);
	}
}