import { User } from "src/utils/typeorm";
import { CreateConversationParams } from "src/utils/types";

export interface IConversationsService {
	createConversation(user: User, conversationParams: CreateConversationParams);
}