import { Group, GroupMessage } from "src/utils/typeorm";
import { CreateGroupMessageParams } from "src/utils/types";

export interface IGroupMessageService {
	createGroupMessage(params: CreateGroupMessageParams);
	getGroupMessages(id: number): Promise<GroupMessage[]>;
}