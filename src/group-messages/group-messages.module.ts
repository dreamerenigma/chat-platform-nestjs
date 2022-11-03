import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupModule } from "src/groups/group.module";
import { MessageController } from "src/messages/message.controller";
import { Services } from "src/utils/constants";
import { GroupMessage, Message } from "src/utils/typeorm";
import { GroupMessageController } from "./group-messages.controller";
import { GroupMessageService } from "./group-messages.service";

@Module({
	imports: [TypeOrmModule.forFeature([GroupMessage]), GroupModule],
	controllers: [GroupMessageController],
	providers: [
		{
			provide: Services.GROUP_MESSAGES,
			useClass: GroupMessageService,
		},
	], 
})
export class GroupMessageModule {}