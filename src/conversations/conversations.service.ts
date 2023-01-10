import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import { ConversationExistsException } from './exceptions/ConversationExists';
import { CreateConversationException } from './exceptions/CreateConversation';
import { CreateConversationDto } from 'src/auth/dtos/CreateConversation.dto';
import { GetConversationMessagesParams, UpdateConversationParams } from './../utils/types';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { Conversation, Message, User } from 'src/utils/typeorm';
import {
	AccessParams,
	CreateConversationParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';
import { ConversationNotFoundException } from './exceptions/ConversationNotFound';

@Injectable()
export class ConversationsService implements IConversationsService {
	constructor(
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		@Inject(Services.USERS)
		private readonly userService: IUserService,
	) { }

	async getConversations(id: number): Promise<Conversation[]> {
		return this.conversationRepository
			.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
			.leftJoinAndSelect('conversation.creator', 'creator')
			.leftJoinAndSelect('conversation.recipient', 'recipient')
			.leftJoinAndSelect('creator.profile', 'creaytorProfile')
			.leftJoinAndSelect('recipient.profile', 'recipientProfile')
			.where('creator.id = :id', { id })
			.orWhere('recipient.id = :id', { id })
			.orderBy('conversation.lastMessageSentAt', 'DESC')
			.getMany();
	}

	async findById(id: number) {
		return this.conversationRepository.findOne({
			where: { id },
			relations: [
				'creator', 
				'recipient',
				'creator.profile',
				'recipient.profile',
				'lastMessageSent', 
			],
		});
	}

	async isCreated(userId: number, recipientId: number) {
		return this.conversationRepository.findOne({
			where: [
				{
					creator: { id: userId },
					recipient: { id: recipientId },
				},
				{
					creator: { id: recipientId },
					recipient: { id: userId },
				},
			],
		});
	}

	async createConversation(user: User, params: CreateConversationParams) {
		const { username, message: content } = params;
		const recipient = await this.userService.findUser({ username });
		if (!recipient) throw new UserNotFoundException();
		// If user is not friends with that user, throw error.
		if (user.id === recipient.id) {
			const error = 'Cannot create Conversation with yourself';
			throw new CreateConversationException(error);
		}
		const exist = await this.isCreated(user.id, recipient.id);
		if (exist) throw new ConversationExistsException();
		const conversation = this.conversationRepository.create({
			creator: user,
			recipient: recipient,
		});
		const savedConversation = await this.conversationRepository.save(
			conversation,
		);
		const messageParams = { content, conversation, author: user };
		const message = this.messageRepository.create(messageParams);
		await this.messageRepository.save(message);
		return savedConversation;
	}

	async hasAccess({ id, userId }: AccessParams) {
		const conversation = await this.findById(id);
		if (!conversation) throw new ConversationNotFoundException();
		return (
			conversation.creator.id === userId || conversation.recipient.id === userId
		);
	}

	save(conversation: Conversation): Promise<Conversation> {
		return this.conversationRepository.save(conversation);
	}

	getMessages({ 
		id, 
		limit,
	}: GetConversationMessagesParams): Promise<Conversation> {
		return this.conversationRepository
			.createQueryBuilder('conversation')
			.where('id = :id', { id })
			.leftJoinAndSelect('conversation.lastMessagesent', 'lastMessageSent')
			.leftJoinAndSelect('conversation.messages', 'message')
			.where('conversation.id = :id', { id })
			.orderBy('message.createAt', 'DESC')
			.limit(limit)
			.getOne();
	}

	update({ id, lastMessageSent }: UpdateConversationParams) {
		return this.conversationRepository.update(id, { lastMessageSent });
	}
}
