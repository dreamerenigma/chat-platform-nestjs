import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IParticipantsService } from 'src/participants/participants';
import { IUserService } from 'src/users/user';
import { Services } from 'src/utils/constants';
import { Conversation, Participant, User } from 'src/utils/typeorm';
import { CreateConversationParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
	participants: any;
	constructor(
		@InjectRepository(Conversation) 
		private readonly conversationRepository: Repository<Conversation>,
		@Inject(Services.PARTICIPANTS)
		private readonly participantsService: IParticipantsService,
		@Inject(Services.USERS)
		private readonly userService: IUserService,
	) {}

	async find(id: number) {
		return this.participantsService.findParticipantConversations(id);
	}

	async findConversationById(id: number): Promise<Conversation> {
		return this.conversationRepository.findOne(id, { relations: ['participants', 'participants.user']});
	}

	async createConversation(user: User, params: CreateConversationParams) {
		const userDB = await this.userService.findUser({ id: user.id });
		const { authorId, recipientId } = params;
		const participants: Participant[] = [];
		if(!userDB.participant) {
			const participant = await this.createParticipantAndSaveUser(
				userDB, 
				authorId,
			);
			return this.participants.push(participant);
		} else participants.push(userDB.participant);
			
		const recipient = await this.userService.findUser({ id: recipientId });
		if (!recipient) 
			throw new HttpException('Recipient Not Found', HttpStatus.BAD_REQUEST);

		if (!recipient.participant) {
			const participant = await this.createParticipantAndSaveUser(
				recipient,
				recipientId,
			);
			return this.participants.push(participant);
		} else participants.push(recipient.participant);
		
		const conversation = this.conversationRepository.create({ participants });
		return this.conversationRepository.save(conversation);
	} 

	public async createParticipantAndSaveUser(user: User, id: number) {
		const participant = await this.participantsService.createParticipant({
			id,
		});
		user.participant = participant;
		return this.userService.saveUser(user);
		return participant;
	}
}