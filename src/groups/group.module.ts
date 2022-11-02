import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Services } from "src/utils/constants";
import { Group } from "src/utils/typeorm";
import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([Group])],
	controllers: [GroupController],
	providers: [
		{
			provide: Services.GROUPS,
			useClass: GroupService,
		},
	],
})
export class GroupModule {}