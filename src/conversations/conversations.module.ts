import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsModule } from 'src/participants/participants.module';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { Conversation, Participant } from 'src/utils/typeorm';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
@Module({
	imports: [
		TypeOrmModule.forFeature([Conversation, Participant]), 
		ParticipantsModule,
		UsersModule,
	],
	controllers: [ConversationsController],
	providers: [
		{
			provide: Services.CONVERSATIONS,
			useClass: ConversationsService,
		},
	],
})
export class ConversationsModule {}