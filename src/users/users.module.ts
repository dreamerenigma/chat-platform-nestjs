import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageStorageModule } from '../image-storage/image-storage.module';
import { Services } from 'src/utils/constants';
import { Profile, User } from 'src/utils/typeorm';
import { UserProfilesController } from './controllers/user-profile.controller';
import { UsersController } from './controllers/user.controller';
import { UserProfileService } from './services/user-profile.service';
import { UserService } from './services/user.service';
import { UserPresenceService } from './services/users-presence.service';
import { UserPresence } from '../utils/typeorm/entities/UserPresence';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, UserPresence, Profile]), 
		ImageStorageModule,
	],
	controllers: [
		UsersController, 
		UserProfilesController,
	],
	providers: [
		{
			provide: Services.USERS,
			useClass: UserService,
		},
		{
			provide: Services.USERS_PROFILES,
			useClass: UserProfileService,
		},
		{
			provide: Services.USER_PRESENCE,
			useClass: UserPresenceService,
		},
	],
	exports: [
		{
			provide: Services.USERS,
			useClass: UserService,
		},
		{
			provide: Services.USERS_PROFILES,
			useClass: UserProfileService,
		},
		{
			provide: Services.USER_PRESENCE,
			useClass: UserPresenceService,
		},
	],
})
export class UsersModule {}
