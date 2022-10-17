import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { 
	MessageBody, 
	OnGatewayConnection, 
	SubscribeMessage, 
	WebSocketGateway, 
	WebSocketServer 
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Message } from 'src/utils/typeorm';
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

	handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
		console.log('New Incoming Connection');
		console.log(socket.user);
		this.sessions.setUserSocket(socket.user.id, socket);
		socket.emit('connected', { status: 'good' });
	}
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('createMessage')
	handleCreateMessage(@MessageBody() data: any) {
		console.log('Create Message');
	}

	@OnEvent('message.create')
	handleMessageCreateEvent(payload: Message) {
		console.log('Inside message.create');
		console.log(payload);
		const {
			author, 
			conversation: { creator, recipient },
		} = payload;

		const authorSocket = this.sessions.getUserSocket(author.id);
		const recipientSocket = author.id === creator.id 
			? this.sessions.getUserSocket(author.id) 
			: this.sessions.getUserSocket(creator.id);
		
		console.log(`Recipient Socket: ${JSON.stringify(recipientSocket.user)}`);

		recipientSocket.emit('onMEssage, payload');
		authorSocket.emit('onMessage', payload);
	}
}