import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/utils/typeorm";
import { CreateGroupMessageParams } from "src/utils/types";
import { Repository } from "typeorm";
import { IGroupMessageService } from "./group-messages";

@Injectable()
export class GroupMessageService implements IGroupMessageService {
	constructor(
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
	) {}
	createGroupMessage(params: CreateGroupMessageParams) {
		this.messageRepository.create()
	}
}