import { FriendRequest } from "src/utils/typeorm";
import { 
	CancelFriendRequestParams, 
	CreateFriendParams, 
	FriendRequestParams, 
} from "src/utils/types";

export interface IFriendRequestService {
	create(params: CreateFriendParams);
	accept(params: FriendRequestParams);
	cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
	reject(params: CancelFriendRequestParams);
	getFriendRequests(userId: number): Promise<FriendRequest[]>;
	isFriends(userOneId: number, userTwoId: number);
	isPending(userOneId: number, userTwoId: number);
	findById(id: number): Promise<FriendRequest>;
}
