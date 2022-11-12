import { GroupMessage } from "src/utils/typeorm";
import { CreateGroupMessageParams, DeleteGroupMessageParams } from "src/utils/types";

export interface IGroupMessageService {
	createGroupMessage(params: CreateGroupMessageParams);
	getGroupMessages(id: number): Promise<GroupMessage[]>;
	deleteGroupMessage(params: DeleteGroupMessageParams);
}