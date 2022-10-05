import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './Conversation';
export { Entity } from 'typeorm';

@Entity({ name: 'participants' })
export class Participant {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => Conversation, (conversation) => conversation.participants)
	@JoinTable()
	conversations: Conversation[];
}