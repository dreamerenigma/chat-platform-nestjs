import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { hashPassword } from 'src/utils/helpers';
import { Peer, User } from 'src/utils/typeorm';
import {
	CreateUserDetails,
	FindUserOptions,
	FindUserParams,
} from 'src/utils/types';
import { IUserService } from '../interfaces/user';

@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Peer) private readonly peerRepository: Repository<Peer>,
	) {}

	async createUser(userDetails: CreateUserDetails) {
		const exitingUser = await this.userRepository.findOne({
			username: userDetails.username,
		});
		if (exitingUser)
			throw new HttpException('User already exists', HttpStatus.CONFLICT);
		const password = await hashPassword(userDetails.password);
		const peer = this.peerRepository.create();
		const params = { ...userDetails, password, peer };
		const newUser = this.userRepository.create(params);
		return this.userRepository.save(newUser);
	}

	async findUser(
		params: FindUserParams,
		options?: FindUserOptions,
	): Promise<User> {
		const selections: (keyof User)[] = [
			'email',
			'username',
			'firstName',
			'lastName',
			'id',
		];
		const selectionWithPassword: (keyof User)[] = [...selections, 'password'];
		return this.userRepository.findOne(params, {
			select: options?.selectAll ? selectionWithPassword : selections,
			relations: ['profile', 'presence', 'peer'],
		});
	}

	async saveUser(user: User) {
		return this.userRepository.save(user);
	}

	searchUsers(query: string) {
		const statement = '(user.username LIKE :query)';
		return this.userRepository
			.createQueryBuilder('user')
			.where(statement, { query: `%${query}%` })
			.limit(10)
			.select([
				'user.username',
				'user.firstName',
				'user.lastName',
				'user.email',
				'user.id',
				'user.profile',
			])
			.getMany();
	}
}
