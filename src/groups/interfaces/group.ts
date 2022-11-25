import { Group, User } from "src/utils/typeorm";
import { 
	AccessParams, 
	CreateGroupParams, 
	FetchGroupsParams, 
	TransferOwnerParams 
} from "src/utils/types";

export interface IGroupService {
	transferGroupOwner(params: { userId: number; groupId: number; newOwnerId: number; }): unknown;
	createGroup(params: CreateGroupParams);
	getGroups(params: FetchGroupsParams): Promise<Group[]>;
	findGroupById(id: number): Promise<Group>;
	saveGroup(group: Group): Promise<Group>;
	hasAccess(params: AccessParams): Promise<User | undefined>;
	transferGroupOwner(params: TransferOwnerParams): Promise<Group>;
}
