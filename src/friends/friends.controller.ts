import { Controller, Get, Inject } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decoratiors";
import { User } from "src/utils/typeorm";
import { IFriendsService } from "./friends";

@Controller(Routes.FRIENDS)
export class FriendsController {
	constructor(
		@Inject(Services.FRIENDS_SERVICE)
		private readonly friendsService: IFriendsService,
	) {}

	@Get()
	getFriends(@AuthUser() user: User) {
		return this.friendsService.getFriends(user.id)
	}
}