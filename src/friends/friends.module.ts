import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Services } from "src/utils/constants";
import { Friend } from "src/utils/typeorm/entities/Friend";
import { FriendsController } from "./friends.controller";
import { FriendsService } from "./friends.service";

@Module({
	imports: [TypeOrmModule.forFeature([Friend]), UsersModule],
	controllers: [FriendsController],
	providers: [
		{
			provide: Services.FRIENDS_SERVICE,
			useClass: FriendsService,
		},
	],
})
export class FriendsModule {}
