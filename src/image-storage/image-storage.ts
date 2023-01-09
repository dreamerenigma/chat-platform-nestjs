import { GroupMessageAttachment } from './../utils/typeorm/entities/GroupMessageAttachment';
import { MessageAttachment } from './../utils/typeorm/entities/MessageAttachment';
import { 
   UploadGroupMessageAttachmentParams,
   UploadImageParams, 
   UploadMessageAttachmentParams, 
} from "src/utils/types";

export interface IImageStorageService {
   upload(params: UploadImageParams);
   uploadMessageAttachment(
      params: UploadMessageAttachmentParams,
   ): Promise<MessageAttachment>;
   uploadGroupMessageAttachment(
      params: UploadGroupMessageAttachmentParams,
   ): Promise<GroupMessageAttachment>;
}
