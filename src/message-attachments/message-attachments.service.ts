import { MessageAttachment } from './../utils/typeorm/entities/MessageAttachment';
import { Inject, Injectable } from "@nestjs/common";
import { Attachment } from "src/utils/types";
import { InjectRepository } from '@nestjs/typeorm';
import { IMessageAttachmentsService } from './message-attachments';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IImageStorageService } from 'src/image-storage/image-storage';

@Injectable()
export class MessageAttachmentsService implements IMessageAttachmentsService {
   constructor(
      @InjectRepository(MessageAttachment)
      private readonly attachmentRepository:Repository<MessageAttachment>,
      @Inject(Services.IMAGE_UPLOAD_SERVICE) 
      private readonly imageUploadService: IImageStorageService,
   ) {}
   create(attachments: Attachment[]) {
      const promise = attachments.map((attachment) => {
         const newAttachment = this.attachmentRepository.create();
         return this.attachmentRepository
            .save(newAttachment)
            .then((messageAttachment) => 
               this.imageUploadService.uploadMessageAttachment({
                  messageAttachment,
                  file: attachment,
               }),
            );
      });
      return Promise.all(promise);
   }

   deleteAllAttachments(attachments: MessageAttachment[]) {
      const promise = attachments.map((attachment) => 
         this.attachmentRepository.delete(attachment.key),
      );
      return Promise.all(promise);
   }
}