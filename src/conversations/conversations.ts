import { Conversation, Participant, User } from "src/utils/typeorm";
import { CreateConversationParams } from "src/utils/types";

export interface IConversationsService {
	createConversation(user: User, conversationParams: CreateConversationParams): Promise<Conversation>
	find(id: number): Promise<Participant>;
	findConversationById(id: number): Promise<Conversation>;
}