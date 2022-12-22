import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friend } from "src/utils/typeorm";
import { Repository } from "typeorm";
import { IFriendsService } from "./friends";
import { DeleteFriendRequestParams } from "src/utils/types";
import { FriendNotFoundException } from "./exceptions/FriendNotFound";
import { DeleteFriendException } from "./exceptions/DeleteFriend";

@Injectable()
export class FriendsService implements IFriendsService {
	constructor(
		@InjectRepository(Friend)
		private readonly friendsRepository: Repository<Friend>,
	) {}
	getFriends(id: number): Promise<Friend[]> {
		return this.friendsRepository.find({
			where: [{ sender: { id } }, { receiver: { id } }],
			relations: ['sender', 'receiver'],
		});
	}

	findFriendById(id: number): Promise<Friend> {
		return this.friendsRepository.findOne(id, {
			relations: ['sender' , 'receiver'],
		});
	}

	async deleteFriend({ id, userId }: DeleteFriendRequestParams) {
		const friend = await this.findFriendById(id);
		if(!friend) throw new FriendNotFoundException();
		console.log(friend);
		if(friend.receiver.id !== userId && friend.sender.id !== userId)
			throw new DeleteFriendException();
		return this.friendsRepository.delete(id);
	}
}