import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { GatewayModule } from './gateway/gateway.module';
import entities from './utils/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupModule } from './groups/group.module';
import { GroupMessageModule } from './group-messages/group-messages.module';
import { ThrottleModule, ThrottleGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		AuthModule, 
		UsersModule,
		ConfigModule.forRoot({ envFilePath: '.env.development' }), 
		PassportModule.register({ session: true }),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.MYSQL_DB_HOST,
			port: parseInt(process.env.MYSQL_DB_PORT),
			username: process.env.MYSQL_DB_USERNAME,
			password: process.env.MYSQL_DB_PASSWORD,
			database: process.env.MYSQL_DB_NAME,
			synchronize: true,
			entities,
		}),
		ConversationsModule,
		MessagesModule,
		GatewayModule,
		EventEmitterModule.forRoot(),
		GroupModule,
		GroupMessageModule,
		ThrottleModule.forRoot({
			ttl: 10,
			limit: 10,
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
		},
	],
})
export class AppModule {}