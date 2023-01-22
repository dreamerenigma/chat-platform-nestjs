import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decorators";
import { User } from "src/utils/typeorm";
import { CreateGroupDto } from "../dtos/CreateGroup.dto";
import { TransferOwnerDto } from "../dtos/TransferOwner.dto";
import { IGroupService } from "../interfaces/group";
import { SkipThrottle } from "@nestjs/throttler";
import { FileInterceptor } from "@nestjs/platform-express";
import { Attachment } from "src/utils/types";
import { UpdateGroupDetailsDto } from "../dtos/UpdateGroupDetails.dto";

@SkipThrottle()
@Controller(Routes.GROUPS)
export class GroupController {
	constructor(
		@Inject(Services.GROUPS) private readonly groupService: IGroupService,
		private eventEmitter: EventEmitter2,
	) { }

	@Post()
	async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
		const group = await this.groupService.createGroup({
			...payload,
			creator: user,
		});
		this.eventEmitter.emit('group.create', group);
		return group;
	}

	@Get()
	getGroups(@AuthUser() user: User) {
		return this.groupService.getGroups({ userId: user.id });
	}

	@Get(':id')
	getGroup(@AuthUser() user: User, @Param('id') id: number) {
		return this.groupService.findGroupById(id);
	}

	@Patch(':id/owner')
	async updateGroupOwner(
		@AuthUser() { id: userId }: User,
		@Param('id') groupId: number,
		@Body() { newOwnerId }: TransferOwnerDto,
	) {
		const params = { userId, groupId, newOwnerId };
		const group = await this.groupService.transferGroupOwner(params);
		this.eventEmitter.emit('group.owner.update', group);
		return group;
	}

	@Patch(':id/details')
	@UseInterceptors(FileInterceptor('avatar'))
	async updateGroupDetails(
		@UploadedFile() file: Attachment, 
		@Body() groupDetailsDto: UpdateGroupDetailsDto,
	) {
		console.log(file);
		console.log(groupDetailsDto);

	}
}
