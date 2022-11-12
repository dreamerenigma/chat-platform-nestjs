import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { Param } from "@nestjs/common/decorators";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decoratiors";
import { User } from "src/utils/typeorm";
import { CreateGroupDto } from "./dtos/CreateGroup.dto";
import { IGroupService } from "./group";

@Controller(Routes.GROUPS)
export class GroupController {
	constructor(
		@Inject(Services.GROUPS) private readonly groupService: IGroupService,
		private eventEmitter: EventEmitter2,
	) {}

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
	getgroups(@AuthUser() user: User, @Param('id') id: number) {
		return this.groupService.findGroupById(id); 
	}
}
