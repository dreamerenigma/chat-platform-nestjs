import { Body, Controller, Inject, Post } from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decoratiors";
import { User } from "src/utils/typeorm";
import { CreateFriendDto } from "./dtos/CreateFriend.dto";
import { IFriendsService } from "./friends";

@Controller(Routes.FRIENDS)
export class FriendsController {
	constructor(
		@Inject(Services.FRIENDS_SERVICE) 
		private readonly friendsService: IFriendsService,
	) {}

	@Post()
	createFriend(
		@AuthUser() user: User, 
		@Body() {email }: CreateFriendDto,
	) {
		const params = { user, email };
		this.friendsService.createFriendRequest(params);
	}
}