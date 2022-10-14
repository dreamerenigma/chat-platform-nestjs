import { Conversation, User } from "src/utils/typeorm";
import { CreateConversationParams } from "src/utils/types";

export interface IConversationsService {
	[x: string]: any;
	createConversation(user: User, conversationParams: CreateConversationParams): Promise<Conversation>
	findConversationById(id: number): Promise<Conversation>;
}