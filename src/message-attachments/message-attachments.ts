import { MessageAttachment } from "src/utils/typeorm";
import { Attachment } from "src/utils/types";

export interface IMessageAttachmentsService {
   create(attachments: Attachment[]): Promise<MessageAttachment[]>;
}
