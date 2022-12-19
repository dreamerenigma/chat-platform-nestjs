import { Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { GroupModule } from 'src/groups/group.module';
import { Services } from 'src/utils/constants';
import { MessagingGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
	imports: [ConversationsModule, GroupModule, FriendsModule],
	providers: [
		MessagingGateway,
		{
			provide: Services.GATEWAY_SESSION_MANAGER,
			useClass: GatewaySessionManager,
		},
	],
	exports: [
		MessagingGateway,
		{
			provide: Services.GATEWAY_SESSION_MANAGER,
			useClass: GatewaySessionManager,
		},
	],
})
export class GatewayModule { }
