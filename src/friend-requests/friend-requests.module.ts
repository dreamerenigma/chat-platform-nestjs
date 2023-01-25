import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsModule } from "src/friends/friends.module";
import { UsersModule } from "src/users/users.module";
import { Services } from "src/utils/constants";
import { Friend } from "src/utils/typeorm/entities/Friend";
import { FriendRequest } from "src/utils/typeorm/entities/FriendRequest";
import { FriendRequestController } from "./friend-requests.controller";
import { FriendRequestService } from "./friend-requests.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Friend, FriendRequest]), 
		UsersModule, 
		FriendsModule,
	],
	controllers: [FriendRequestController],
	providers: [
		{
			provide: Services.FRIENDS_REQUESTS_SERVICE,
			useClass: FriendRequestService,
		},
	],
})
export class FriendRequestModule {}
