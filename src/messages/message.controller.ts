import { 
	Body, 
	Controller, 
	Delete, 
	Get, 
	Inject, 
	Param, 
	ParseIntPipe, 
	Post
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decoratiors';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { IMessageService } from './message';

@Controller(Routes.MESSAGES)
export class MessageController {
	constructor(
		@Inject(Services.MESSAGES) private readonly messageService: IMessageService,
		private eventEmitter: EventEmitter2,
		) {}

		@Post()
		async createMessage(
			@AuthUser() user: User,
			@Body() {content }: CreateMessageDto,
			@Param('id', ParseIntPipe) conversationId: number,
		)	{
			const params = {user, conversationId, content };
			const response = await this.messageService.createMessage(params);
			this.eventEmitter.emit('message.create', response);
			return;
		}

		@Get()
		async getMessagesFromConversation(
			@AuthUser() user: User,
			@Param('id', ParseIntPipe) id: number,
		) {
			console.log(id);
			const messages = await this.messageService.getMessagesByConversationId(id);
			return { id, messages };
		}

		@Delete(':messageId')
		async deleteMessageFromnConversation(
			@AuthUser() user: User,
			@Param('id', ParseIntPipe) conversationId: number,
			@Param('messageId', ParseIntPipe) messageId: number,
		) {
			await this.messageService.deleteMessage({
				userId: user.id,
				conversationId,
				messageId,
			});
		}
}
