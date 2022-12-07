import { FriendRequest } from "src/utils/typeorm";
import { 
	CancelFriendRequestParams, 
	CreateFriendParams, 
	FriendRequestParams 
} from "src/utils/types";

export interface IFriendRequestService {
	accept(params: FriendRequestParams);
	cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
	reject(params: CancelFriendRequestParams);
	create(params: CreateFriendParams);
	isFriends(userOneId: number, userTwoId: number);
	getFriendRequests(userId: number): Promise<FriendRequest[]>;
	isPending(userOneId: number, userTwoId: number);
	findById(id: number): Promise<FriendRequest>;
}