import { Conversation, User } from "src/utils/typeorm";
import { CreateConversationParams } from "src/utils/types";

export interface IConversationsService {
	createConversation(
		user: User, 
		conversationParams: CreateConversationParams
	): Promise<Conversation>;
	getConversations(id: number): Promise<Conversation[]>;
	findById(id: number): Promise<Conversation>;
}