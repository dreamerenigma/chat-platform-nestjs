import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { Conversation, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
	constructor(
		@InjectRepository(Conversation) 
		private readonly conversationRepository: Repository<Conversation>,
		@Inject(Services.USERS)
		private readonly userService: IUserService,
	) {}

	async getConversations(id: number): Promise<Conversation[]> {
		return this.conversationRepository
			.createQueryBuilder('conversation')
			.leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
			.leftJoinAndSelect('conversation.creator', 'creator')
			.addSelect([
				'creator.id',
				'creator.firstName',
            'creator.lastName',
				'creator.email',
			])
			.leftJoinAndSelect('conversation.recipient', 'recipient')
			.addSelect([
				'recipient.id',
				'recipient.firstName',
				'recipient.lastName',
				'recipient.email',
		])
		.where('creator.id = :id', { id })
		.orWhere('recipient.id = :id', { id })
		.orderBy('conversation.id', 'DESC')
		.getMany();
	}

	async findConversationById(id: number): Promise<Conversation> {
		return this.conversationRepository.findOne(id);
	}

	async createConversation(user: User, params: CreateConversationParams) {
		const { recipientId } = params

		if(user.id === params.recipientId) {
			throw new HttpException(
				'Cannot create conversation',
				HttpStatus.BAD_REQUEST,
			);
			const existingConversation = await this.conversationRepository.findOne({
				where: [
					{
						creator: { id: user.id },
						recipient: { id: recipientId },
					},
					{
						creator: { id: recipientId },
						recipient: { id: user.id },
					},
				],
			});
		
			if (existingConversation)
				throw new HttpException('Recipient Not Found', HttpStatus.CONFLICT);
			const recipient = await this.userService.findUser({ id: recipientId });
			
			if (!recipient) 
				throw new HttpException('Recipient Not Found', HttpStatus.BAD_REQUEST);
			
			const conversation = this.conversationRepository.create({ 
				creator: user,
				recipient: recipient,
			});

			return this.conversationRepository.save(conversation);
		}
	}
}