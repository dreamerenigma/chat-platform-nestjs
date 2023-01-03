import { UserProfilesController } from './controllers/user-profile.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController, UserProfilesController],
	providers: [
		{
			provide: Services.USERS,
			useClass: UserService,
		}
	],
	exports: [
		{
			provide: Services.USERS,
			useClass: UserService,
		},
	],
})
export class UsersModule { }
