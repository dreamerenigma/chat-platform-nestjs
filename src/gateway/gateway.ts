import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { 
	ConnectedSocket,
	MessageBody, 
	OnGatewayConnection, 
	OnGatewayDisconnect, 
	OnGatewayInit, 
	SubscribeMessage, 
	WebSocketGateway, 
	WebSocketServer 
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { IConversationsService } from 'src/conversations/conversations';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Conversation, Message } from 'src/utils/typeorm';
import { CreateGroupMessageResponse, CreateMessageResponse } from 'src/utils/types';
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
		@Inject(Services.CONVERSATIONS)
		private readonly conversationService: IConversationsService,
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
		console.log('Incoming Connection');
		console.log(socket.user);
		this.sessions.setUserSocket(socket.user.id, socket);
		socket.emit('connected', {});
	}

	// handleDisconnect(client: any) {
	// 	console.log('Client Disconnect');
	// }

	// @SubscribeMessage('onConnect')
	// handleOnConnect(@ConnectedSocket() client: AuthenticatedSocket) {
	// 	this.sessions.setUserSocket
	// }

	@SubscribeMessage('createMessage')
	handleCreateMessage(@MessageBody() data: any) {
		console.log('Create Message');
	}

	@SubscribeMessage('onConversationJoin')
	onConversationJoin(
		@MessageBody() data: any,
		@ConnectedSocket() client: AuthenticatedSocket,
	) {
		console.log(`${client.user?.id} joined a Conversation of ID: ${data.conversationId}`,
		);
		client.join(`conversation-${data.conversationId}`);
		console.log(client.rooms);
		client.to(data.conversationId).emit('userJoin');
	}

	@SubscribeMessage('onConversationLeave')
	onConversationLeave(
		@MessageBody() data: any,
		@ConnectedSocket() client: AuthenticatedSocket,
	) {
		console.log('onConversationLeave');
		client.join(`conversation-${data.conversationId}`);
		console.log(client.rooms);
		client.to(`conversation-${data.conversationId}`).emit('userLeave');
	}

	@SubscribeMessage('onTypingStart')
	onTypingStart(
		@MessageBody() data: any,
		@ConnectedSocket() client: AuthenticatedSocket,
	) {
		console.log('onTypingStart');
		client.join(data.conversationId)
		console.log(client.rooms);
		client.to(`conversation-${data.conversationId}`).emit('onTypingStart');
	}

	@SubscribeMessage('onTypingStop')
	onTypingStop(
		@MessageBody() data: any,
		@ConnectedSocket() client: AuthenticatedSocket,
	) {
		console.log('onTypingStop');
		client.join(data.conversationId)
		console.log(client.rooms);
		client.to(`conversation-${data.conversationId}`).emit('onTypingStop');
	}

	@OnEvent('message.create')
	handleMessageCreateEvent(
		@ConnectedSocket() client: AuthenticatedSocket,
		payload: CreateMessageResponse
	) {
		console.log('Inside message.create');
		console.log(payload);
		const { author, conversation } = payload.message;
		console.log(this.server.sockets.adapter.rooms);
		this.server
			.to(`conversation-${conversation.id}`)
			.emit('onMessage', payload);

		// const authorSocket = this.sessions.getUserSocket(author.id);
		// const recipientSocket = author.id === creator.id 
		// 	? this.sessions.getUserSocket(recipient.id) 
		// 	: this.sessions.getUserSocket(creator.id);

		// if (authorSocket) authorSocket.emit('onMessage', payload);
		// console.log(authorSocket);
		// console.log(recipientSocket);
		// if (recipientSocket) recipientSocket.emit('onMessage', payload);
	}

	@OnEvent('conversation.create')
	handleConversationCreateEvent(payload: Conversation) {
		console.log('Inside conversation.create');
		console.log(payload.recipient);
		const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);
		if (recipientSocket) recipientSocket.emit('onConversation', payload);
	}

	@OnEvent('message.delete')
	async handleMessageDelete(payload) {
		console.log('Inside message.delete');
		console.log(payload);
		const conversation = await this.conversationService.findConversationById(
			payload.conversationId,
		);
		if (!conversation) return;
		const { creator, recipient } = conversation;
		const recipientSocket = creator.id === payload.userId
			? this.sessions.getUserSocket(recipient.id)
			: this.sessions.getUserSocket(creator.id);
		if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
	}

	@OnEvent('message.update')
	async handleMessageUpdate(message: Message) {
		const {
			author,
			conversation: { creator, recipient },
		} = message;
		console.log(message);
		const recipientSocket = 
			author.id === creator.id
				? this.sessions.getUserSocket(recipient.id)
				: this.sessions.getUserSocket(creator.id);
		if (recipientSocket) recipientSocket.emit('onMessageUpdate', message);
	}

	@OnEvent('group.message.create')
	async handleGroupMessageCreate(payload: CreateGroupMessageResponse) {
		const { id } = payload.group;
		console.log('Inside group.message.create');
		this.server.to(`group-${id}`).emit('onGroupMessage', payload);
	}
}