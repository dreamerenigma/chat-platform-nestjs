import { Conversation, User } from "src/utils/typeorm";
import { AccessParams, CreateConversationParams } from "src/utils/types";

export interface IConversationsService {
	createConversation(
		user: User, 
		conversationParams: CreateConversationParams
	): Promise<Conversation>;
	getConversations(id: number): Promise<Conversation[]>;
	findConversationById(id: number): Promise<Conversation | undefined>;
	hasAccess(params: AccessParams): Promise<boolean>;
}