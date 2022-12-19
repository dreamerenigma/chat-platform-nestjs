import { Module } from '@nestjs/common';
import { FriendRequestEvents } from "./friend-requests.events";
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
	imports: [GatewayModule],
	providers: [FriendRequestEvents],
})
export class EventsModule {}
