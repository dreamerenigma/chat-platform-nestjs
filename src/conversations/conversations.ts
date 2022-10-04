import { CreateConversationParams } from "src/utils/types";

export interface IConversationsService {
	createConversation(conversationParams: CreateConversationParams);
}