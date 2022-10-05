import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Participant } from 'src/utils/typeorm';
import { ParticipantsService } from './participants.service';

@Module({
	imports: [TypeOrmModule.forFeature([Participant])],
	providers: [
		{
			provide: Services.PARTICIPANTS,
			useClass: ParticipantsService,
		},
	],
	exports: [
		{
			provide: Services.PARTICIPANTS,
			useClass: ParticipantsService,
		},
	],
})
export class ParticipantsModule {}
