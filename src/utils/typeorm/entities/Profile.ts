import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { User } from './User';

@Entity({ name: 'profiles'})
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: '' })
	about?: string;

	@Column({ nullable: true })
	avatar?: string;

	@OneToOne(() => User)
	user: User;
}
