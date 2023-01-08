import { Attachment } from "src/utils/types";
import { MessageAttachment } from "src/utils/typeorm";

export interface IMessageAttachmentsService {
   create(attachments: Attachment[]): Promise<MessageAttachment[]>;
   deleteAllAttachments(attachments: MessageAttachment[]);
}
