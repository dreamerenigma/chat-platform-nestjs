import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { CreateConversationDto } from 'src/auth/dtos/CreateConversation.dto';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decoratiors';
import { Participant, User } from 'src/utils/typeorm';
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

	@Get()
	async getConversations(@AuthUser() user: User) {
		const { id } = user.participant;
		const participant = await this.conversationsService.find(user.participant.id);
		// return participant.conversations.map((conversations) => ({
		// 	...conversations,
		// 		recipient: conversations.participants.filter((p) => p.id !== user.id),
		// 	}));
		return participant;
	}

	@Get(':id')
	async getConversationById(@Param('id') id: number) {
		const conversation = await this.conversationsService.findConversationById(id);
		return conversation;
	}
}