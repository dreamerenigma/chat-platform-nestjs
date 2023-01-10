import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';
import { MessageAttachmentsModule } from 'src/message-attachments/message-attachments.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FriendsModule } from '../friends/friends.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Message, Conversation]),
		ImageStorageModule,
		MessageAttachmentsModule,
		ConversationsModule,
		FriendsModule,
	],
	controllers: [MessageController],
	providers: [
		{
			provide: Services.MESSAGES,
			useClass: MessageService,
		},
	],
})
export class MessagesModule {}
