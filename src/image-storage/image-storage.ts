import { MessageAttachment } from './../utils/typeorm/entities/MessageAttachment';
import { 
   UploadImageParams, 
   UploadMessageAttachmentParams, 
} from "src/utils/types";

export interface IImageStorageService {
   upload(params: UploadImageParams);
   uploadMessageAttachment(params: UploadMessageAttachmentParams): Promise<MessageAttachment>;
}
