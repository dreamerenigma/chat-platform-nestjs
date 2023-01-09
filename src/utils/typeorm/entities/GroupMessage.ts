import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseMessage } from "./BaseMessage";
import { Group } from "./Group";
import { MessageAttachment } from "./MessageAttachment";
import { GroupMessageAttachment } from "./GroupMessageAttachment";

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
	@ManyToOne(() => Group, (group) => group.messages)
	group: Group;

	@OneToMany(() => GroupMessageAttachment, (attachment) => attachment.message)
	@JoinColumn()
	attachments?: MessageAttachment[];
}
