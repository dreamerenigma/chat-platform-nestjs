import { FriendRequest } from "src/utils/typeorm";
import { 
	CancelFriendRequestParams, 
	CreateFriendParams, 
	FriendRequestParams 
} from "src/utils/types";

export interface IFriendRequestService {
	create(params: CreateFriendParams);
	cancel(params: CancelFriendRequestParams);
	getFriendRequest(userId: number): Promise<FriendRequest[]>;
	isPending(userOneId: number, userTwoId: number);
	isFriends(userOneId: number, userTwoId: number);
	accept(params: FriendRequestParams);
	findById(id: number): Promise<FriendRequest>;
}