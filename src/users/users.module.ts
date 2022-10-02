import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { User } from 'src/utils/typeorm';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
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
export class UsersModule {}
