import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { IGroupService } from "src/groups/group";
import { Services } from "src/utils/constants";
import { GroupMessage } from "src/utils/typeorm";
import { CreateGroupMessageParams } from "src/utils/types";
import { Repository } from "typeorm";
import { IGroupMessageService } from "./group-messages";

@Injectable()
export class GroupMessageService implements IGroupMessageService {
	constructor(
		@InjectRepository(GroupMessage)
		private readonly groupMessageRepository: Repository<GroupMessage>,
		@Inject(Services.GROUPS)
		private readonly groupService: IGroupService,
	) {}

	async createGroupMessage({
		groupId: id,
		...params
	}: CreateGroupMessageParams) {
		const { content, author } = params;
		const group = await this.groupService.findGroupById(id);
		if (!group)
			throw new HttpException('No Group Found', HttpStatus.BAD_REQUEST);
		const findUser = group.users.find((u) => u.id === params.author.id);
		if (!findUser)
			throw new HttpException('User not in group', HttpStatus.BAD_REQUEST);
		
		const groupMessage = this.groupMessageRepository.create({ 
			content,
			group,
			author: instanceToPlain(author),
		});
		const savedMessage = await this.groupMessageRepository.save(groupMessage);
		group.lastMessageSent = savedMessage;
		return this.groupService.saveGroup(group);
	}
}