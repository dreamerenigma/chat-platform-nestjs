import { AddGroupRecipientParams, RemoveGroupRecipientParams } from "src/utils/types";

export interface IGroupRecipientService {
	addGroupRecipient(params: AddGroupRecipientParams);
	removeGroupRecipient(params: RemoveGroupRecipientParams);
}