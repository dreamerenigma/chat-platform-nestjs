import { Group } from "src/utils/typeorm";
import { 
	AddGroupRecipientParams, 
	AddGroupUserResponse, 
	RemoveGroupRecipientParams,
	RemoveGroupUserResponse,
} from "src/utils/types";

export interface IGroupRecipientService {
	addGroupRecipient(params: AddGroupRecipientParams): Promise<AddGroupUserResponse>;
	removeGroupRecipient(params: RemoveGroupRecipientParams): Promise<RemoveGroupUserResponse>;
}