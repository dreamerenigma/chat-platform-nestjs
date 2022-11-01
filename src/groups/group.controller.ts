import { Body, Controller, Inject, Post } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decoratiors";
import { User } from "src/utils/typeorm";
import { IGroupService } from "./group";

@Controller(Routes.GROUPS)
export class GroupController {
	constructor(
		@Inject(Services.GROUPS) private readonly groupService: IGroupService,
	) {}

	@Post()
	async createGroup(
		@AuthUser() user: User,
		@Body() createGroupPayload) {}
}
