import {
	Controller,
	Param,
	ParseIntPipe,
	Post,
	Body,
	Inject,
} from '@nestjs/common';
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
	) {}

	@Post()
	addGroupRecipient(
		@AuthUser() { id: userId }: User,
		@Param('id', ParseIntPipe) id: number,
		@Body() { email }: AddGroupRecipientDto,
	) {
		const params = { id, userId, email };
		return this.groupRecipientService.addGroupRecipient(params);
	}
}
