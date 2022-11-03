import { Entity, ManyToOne } from "typeorm";
import { BaseMessage } from "./BaseMessage";
import { Conversation } from "./Conversation";

@Entity({ name: 'messages' })
export class Message extends BaseMessage {
	@ManyToOne(() => Conversation, (conversation) => conversation.messages)
	conversation: Conversation;
}