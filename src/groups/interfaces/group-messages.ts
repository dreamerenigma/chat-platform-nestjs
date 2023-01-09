import { Group, GroupMessage } from "src/utils/typeorm";
import { 
	CreateGroupMessageParams, 
	DeleteGroupMessageParams, 
	EditGroupMessageParams, 
} from "src/utils/types";

export interface IGroupMessageService {
	createGroupMessage(params: CreateGroupMessageParams);
	getGroupMessages(id: number): Promise<GroupMessage[]>;
	deleteGroupMessage(params: DeleteGroupMessageParams);
	editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage>;
}
