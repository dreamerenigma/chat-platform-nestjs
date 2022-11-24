import {
	Controller,
	Param,
	ParseIntPipe,
	Post,
	Body,
	Inject,
	Delete,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from 'src/utils/decoratiors';
import { Routes, Services } from '../../utils/constants';
import { User } from '../../utils/typeorm';
import { AddGroupRecipientDto } from '../dtos/AddGroupRecipient.dto';
import { IGroupRecipientService } from '../interfaces/group-recipient';

@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientsController {
	constructor(
		@Inject(Services.GROUP_RECIPIENTS)
		private readonly groupRecipientService: IGroupRecipientService,
		private eventEmitter: EventEmitter2,
	) {}

	@Post()
	async addGroupRecipient(
		@AuthUser() { id: userId }: User,
		@Param('id', ParseIntPipe) id: number,
		@Body() { email }: AddGroupRecipientDto,
	) {
		const params = { id, userId, email };
		const response = await this.groupRecipientService.addGroupRecipient(params);
		this.eventEmitter.emit('group.user.add', response );
		return response.group;
	}

	@Delete(':userId')
	async removeGroupRecipient(
		@AuthUser() { id: issuerId }: User,
		@Param('id', ParseIntPipe) id: number,
		@Param('userId', ParseIntPipe) removeUserId: number,
	) {
		const params = { issuerId, id, removeUserId };
		const response = await this.groupRecipientService.removeGroupRecipient(params);
		this.eventEmitter.emit('group.user.remove', response);
		return response.group;
	}
}
