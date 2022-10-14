import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decoratiors';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { IMessageService } from './message';

@Controller(Routes.MESSAGES)
export class MessageController {
	constructor(
		@Inject(Services.MESSAGES) private readonly messageService: IMessageService) {}
			
		@Post()	
		createMessage(
			@AuthUser() user: User,
			@Body() createMessageDto: CreateMessageDto,
		) {
		return this.messageService.createMessage({...createMessageDto, user });
			}

		@Get(':conversationId')
		getMessagesFromConversation(
			@AuthUser() user: User,
			@Param('conversationId') conversationId: number,
	) {
		return this.messageService.getMessagesByConversationId(conversationId);
	}
}
