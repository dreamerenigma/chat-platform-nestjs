import { Group } from "src/utils/typeorm";
import { CreateGroupParams, FetchGroupsParams } from "src/utils/types";

export interface IGroupService {
	createGroup(params: CreateGroupParams);
	getGroups(params: FetchGroupsParams): Promise<Group[]>;
	getGroupById(id: number): Promise<Group>;
}
