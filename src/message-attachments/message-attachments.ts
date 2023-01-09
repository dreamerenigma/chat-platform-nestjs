import { Attachment } from "src/utils/types";
import { GroupMessageAttachment, MessageAttachment } from "src/utils/typeorm";

export interface IMessageAttachmentsService {
   create(attachments: Attachment[]): Promise<MessageAttachment[]>;
   createGroupAttachments(
      attachments: Attachment[],
   ): Promise<GroupMessageAttachment[]>;
   deleteAllAttachments(attachments: MessageAttachment[]);
}
