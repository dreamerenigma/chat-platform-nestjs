import { 
	Body, 
	Controller, 
	Delete, 
	Get, 
	Inject, 
	Param, 
	Post, 
	UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decoratiors';
import { User } from 'src/utils/typeorm';
import { IConversationsService } from './conversations';
import { CreateConversationDto } from 'src/auth/dtos/CreateConversation.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
	constructor( 
		@Inject(Services.CONVERSATIONS)
		private readonly conversationsService: IConversationsService,
		private readonly events: EventEmitter2,
	) {}

	@Post()
	async createConversation(
		@AuthUser() user: User,
		@Body() createConversationPayload: CreateConversationDto,
	) {
		console.log('createConversation');
		const conversation = await this.conversationsService.createConversation(
			user, 
			createConversationPayload,
		);
		this.events.emit('conversation.create', conversation);
		return conversation; 
	}

	@Get()
	async getConversations(@AuthUser() { id }: User) {
		return this.conversationsService.getConversations(id);
	}

	@Get(':id')
	async getConversationById(@Param('id') id: number) {
		const conversation = await this.conversationsService.findConversationById(id);
		return conversation;
	}
}