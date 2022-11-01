import { Controller, Inject } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IGroupService } from "./group";

@Controller(Routes.GROUPS)
export class GroupController {
	constructor(
		@Inject(Services.GROUPS) private readonly groupService: IGroupService,
	) {}
}
