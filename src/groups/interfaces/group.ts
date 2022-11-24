import { Group, User } from "src/utils/typeorm";
import { AccessParams, CreateGroupParams, FetchGroupsParams } from "src/utils/types";

export interface IGroupService {
	createGroup(params: CreateGroupParams);
	getGroups(params: FetchGroupsParams): Promise<Group[]>;
	findGroupById(id: number): Promise<Group>;
	saveGroup(group: Group): Promise<Group>;
	hasAccess(params: AccessParams): Promise<User | undefined>;
}
