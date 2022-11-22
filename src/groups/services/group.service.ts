import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUserService } from "src/users/user";
import { Services } from "src/utils/constants";
import { Group } from "src/utils/typeorm";
import { CreateGroupParams, FetchGroupsParams } from "src/utils/types";
import { Repository } from "typeorm";
import { IGroupService } from "../interfaces/group";

@Injectable()
export class GroupService implements IGroupService {
	constructor(
		@InjectRepository(Group)
		private readonly groupRepository: Repository<Group>,
		@Inject(Services.USERS)
		private readonly userService: IUserService,
	) {}

	async createGroup(params: CreateGroupParams) {
		const { creator, title } = params;
		const usersPromise = params.users.map((email) => 
			this.userService.findUser({ email }), 
		);
		const users = (await Promise.all(usersPromise)).filter((user) => user);
		users.push(creator);
		console.log(users);
		const group = this.groupRepository.create({ users, creator, title });
		return this.groupRepository.save(group);
	}

	getGroups(params: FetchGroupsParams): Promise<Group[]> {
		return this.groupRepository
			.createQueryBuilder('group')
			.leftJoinAndSelect('group.users', 'user')
			.where('user.id IN (:users)', { users: [params.userId] })
			.leftJoinAndSelect('group.users', 'users')
			.leftJoinAndSelect('group.creator', 'creator')
			.getMany();
	}

	findGroupById(id: number): Promise<Group> {
		return this.groupRepository.findOne({ 
			where: { id }, 
			relations: ['creator', 'users', 'lastMessageSent'],
		});
	}

	saveGroup(group: Group): Promise<Group> {
		return this.groupRepository.save(group);
	}
}
