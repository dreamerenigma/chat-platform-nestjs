import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
	imports: [TypeOrmModule.forFeature([Message, Conversation])],
	controllers: [MessageController],
	providers: [{
		provide: Services.MESSAGES,
      useClass: MessageService,
	}]
})
export class MessagesModule {}

