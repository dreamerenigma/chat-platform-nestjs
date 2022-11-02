import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import { CreateUserDetails, FindUserOptions, FindUserParams } from 'src/utils/types';
import { Repository } from 'typeorm/repository/Repository';
import { IUserService } from './user';

@Injectable()
export class UserService implements IUserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async createUser(userDetails: CreateUserDetails) {
		const exitingUser = await this.userRepository.findOne({ 
			email: userDetails.email,
		});
		if (exitingUser) 
			throw new HttpException('User already exists', HttpStatus.CONFLICT);
		const password = await hashPassword(userDetails.password);
		const newUser = this.userRepository.create({ ...userDetails, password });
		return this.userRepository.save(newUser);
	}

	async findUser(findUserParams: FindUserParams): Promise<User> {
		return this.userRepository.findOne(findUserParams);
	}

	async saveUser(user: User) {
		return this.userRepository.save(user);
	}
}