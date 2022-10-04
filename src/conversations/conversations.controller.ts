import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateConversationDto } from 'src/auth/dtos/CreateConversation.dto';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { IConversationsService } from './conversations';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
	constructor( 
		@Inject(Services.CONVERSATIONS)
		private readonly conversationsService: IConversationsService,
		){}

	@Post()
	createConversation(@Body() createConversationPayload: CreateConversationDto) {
		console.log(createConversationPayload)
		this.conversationsService.createConversation(createConversationPayload);
	}
}