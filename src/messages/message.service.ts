import { CannotDeleteMessage } from './exceptions/CannotDeleteMessage';
import { ConversationNotFoundException } from './../conversations/exceptions/ConversationNotFound';
import { Services } from 'src/utils/constants';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Conversation, Message, User } from 'src/utils/typeorm';
import {
	CreateMessageParams,
	DeleteMessageParams,
	EditMessageParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { IMessageService } from './message';
import { IMessageAttachmentsService } from 'src/message-attachments/message-attachments';
import { IConversationsService } from 'src/conversations/conversations';
import { CannotCreateMessageException } from './exceptions/CannotCreateMessage';

@Injectable()
export class MessageService implements IMessageService {
	constructor(
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		@Inject(Services.CONVERSATIONS)
		private readonly conversationService: IConversationsService,
		@Inject(Services.MESSAGE_ATTACHMENTS)
		private readonly messageAttachmentsService: IMessageAttachmentsService,
	) { }
	async createMessage(params: CreateMessageParams) {
		const { user, content, id } = params;
		const conversation = await this.conversationService.findById(id,);
		if (!conversation) throw new ConversationNotFoundException();
		const { creator, recipient } = conversation;
		if (creator.id !== user.id && recipient.id !== user.id)
			throw new CannotCreateMessageException();
		const message = this.messageRepository.create({
			content,
			conversation,
			author: instanceToPlain(user),
			attachments: params.attachments
				? await this.messageAttachmentsService.create(params.attachments)
				: [],
		});
		const savedMessage = await this.messageRepository.save(message);
		conversation.lastMessageSent = savedMessage;
		const updatedConversation = await this.conversationService.save(conversation);
		return { message: savedMessage, conversation: updatedConversation };
	}

	getMessagesByConversationId(conversationId: number): Promise<Message[]> {
		return this.messageRepository.find({
			relations: ['author', 'attachments'],
			where: { conversation: { id: conversationId } },
			order: { createdAt: 'DESC' },
		});
	}

	async deleteMessage(params: DeleteMessageParams) {
		const { conversationId } = params;
		const msgParams = { id: conversationId, limit: 5 };
		const conversation = await this.conversationService.getMessages(msgParams);
		if (!conversation) throw new ConversationNotFoundException();
		const message = await this.messageRepository.findOne({
			id: params.messageId,
			author: { id: params.userId },
			conversation: { id: params.conversationId },
		});
		if (!message) throw new CannotDeleteMessage();
		if (conversation.lastMessageSent.id !== message.id)
			return this.messageRepository.delete({ id: message.id });
		return this.deleteLastMessage(conversation, message);
	}

	async deleteLastMessage(conversation: Conversation, message: Message) {
		const size = conversation.messages.length;
		const SECOND_MESSAGE_INDEX = 1;
		if (size <= 1) {
			console.log('Last Message Sent is deleted');
			await this.conversationService.update({
				id: conversation.id,
				lastMessageSent: null,
			});
			return this.messageRepository.delete({ id: message.id });
		} else {
			console.log('There are more than 1 message');
			const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
			await this.conversationService.update({
				id: conversation.id,
				lastMessageSent: newLastMessage,
			});
			return this.messageRepository.delete({ id: message.id });
		}
	}

	async editMessage(params: EditMessageParams) {
		const messageDB = await this.messageRepository.findOne({
			where: {
				id: params.messageId,
				author: { id: params.userId },
			},
			relations: [
				'conversation',
				'conversation.creator',
				'conversation.recipient',
				'author',
			],
		});
		if (!messageDB)
			throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
		messageDB.content = params.content;
		return this.messageRepository.save(messageDB);
	}
}