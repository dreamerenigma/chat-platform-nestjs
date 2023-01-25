import { GroupMessageAttachment, MessageAttachment } from '../utils/typeorm';
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
