import { 
	Body, 
	Controller,
	Delete,
	Get,
	Inject, 
	Param,
	ParseIntPipe, 
	Patch,
	Post, 
} from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { AuthUser } from "src/utils/decoratiors";
import { User } from "src/utils/typeorm";
import { CreateFriendDto } from "./dtos/CreateFriend.dto";
import { IFriendRequestService } from "./friend-requests";

@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestController {
	constructor(
		@Inject(Services.FRIENDS_REQUESTS_SERVICE) 
		private readonly friendRequestService: IFriendRequestService,
	) {}

	@Get()
	getFriendRequest(@AuthUser() user: User) {
		return this.friendRequestService.getFriendRequest(user.id);
	}

	@Post()
	createFriend(
		@AuthUser() user: User, 
		@Body() {email }: CreateFriendDto,
	) {
		const params = { user, email };
		this.friendRequestService.create(params);
	}

	@Patch(':id/accept')
	acceptFriendRequest(
		@AuthUser() {id: userId }: User,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.friendRequestService.accept({ id, userId });
	}

	@Delete(':id/cancel')
	cancelFriendRequest(
		@AuthUser() { id: userId }: User,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.friendRequestService.cancel({ id, userId });
	}
}
