import { MessageAttachmentsService } from './message-attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MessageAttachment } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';

@Module({
   imports: [TypeOrmModule.forFeature([MessageAttachment]), ImageStorageModule],
   providers: [
      {
         provide: Services.MESSAGE_ATTACHMENTS,
         useClass: MessageAttachmentsService,
      },
   ],
   exports: [
      {
         provide: Services.MESSAGE_ATTACHMENTS,
         useClass: MessageAttachmentsService,
      },
   ],
})
export class MessageAttachmentsModule {}
