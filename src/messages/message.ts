import { Message } from "src/utils/typeorm";
import { CreateMessageParams, CreateMessageResponse } from "src/utils/types";

export interface IMessageService {
	createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;
	getMessagesByConversationId(conversationId: number): Promise<Message[]>;
}
