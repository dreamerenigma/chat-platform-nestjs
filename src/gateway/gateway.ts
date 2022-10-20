import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { 
	ConnectedSocket,
	MessageBody, 
	OnGatewayConnection, 
	OnGatewayInit, 
	SubscribeMessage, 
	WebSocketGateway, 
	WebSocketServer 
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Conversation, Message } from 'src/utils/typeorm';
import { CreateMessageResponse } from 'src/utils/types';
import { IGatewaySessionManager } from './gateway.session';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000'],
		credentials: true,
	},
})
export class MessagingGateway implements OnGatewayConnection {
	constructor(
		@Inject(Services.GATEWAY_SESSION_MANAGER) 
		private readonly sessions: IGatewaySessionManager,
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
		console.log('New Incoming Connection');
		console.log(socket.user);
		this.sessions.setUserSocket(socket.user.id, socket);
		socket.emit('connected', { status: 'good' });
	}

	@SubscribeMessage('createMessage')
	handleCreateMessage(@MessageBody() data: any) {
		console.log('Create Message');
	}

	@SubscribeMessage('onClientConnect')
	onClientConnect(
		@MessageBody() data: any,
		@ConnectedSocket() client: AuthenticatedSocket,
	) {
		console.log('onClientConnect');
		console.log(data);
		console.log(client.user);
	}

	@OnEvent('message.create')
	handleMessageCreateEvent(payload: CreateMessageResponse) {
		console.log('Inside message.create');
		const {
			author, 
			conversation: { creator, recipient },
		} = payload.message;

		const authorSocket = this.sessions.getUserSocket(author.id);
		const recipientSocket = author.id === creator.id 
			? this.sessions.getUserSocket(recipient.id) 
			: this.sessions.getUserSocket(creator.id);

		if (authorSocket) authorSocket.emit('onMessage', payload);
		if (recipientSocket) recipientSocket.emit('onMessage', payload);
	}

	@OnEvent('conversation.create')
	handleConversationCreateEvent(payload: Conversation) {
		console.log('Inside conversation.create');
		console.log(payload.recipient);
		const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);
		if (recipientSocket) recipientSocket.emit('onConversation', payload);
	}
}