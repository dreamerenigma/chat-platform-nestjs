import { FriendRequest } from "src/utils/typeorm";
import { CreateFriendParams, FriendRequestParams } from "src/utils/types";

export interface IFriendRequestService {
	create(params: CreateFriendParams);
	getFriendRequest(userId: number): Promise<FriendRequest[]>;
	isPending(userOneId: number, userTwoId: number);
	isFriends(userOneId: number, userTwoId: number);
	accept(params: FriendRequestParams);
	findById(id: number): Promise<FriendRequest>;
}