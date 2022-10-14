import { Message } from "src/utils/typeorm";
import { CreateMessageParams } from "src/utils/types";

export interface IMessageService {
	createMessage(params: CreateMessageParams): 
	Promise<Message>;
	getMessagesByConversationId(conversationId: number):
	Promise<Message[]>;
}
