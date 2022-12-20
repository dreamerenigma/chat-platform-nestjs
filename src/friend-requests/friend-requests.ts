import { FriendRequest } from "src/utils/typeorm";
import { 
	AcceptFriendRequestResponse,
	CancelFriendRequestParams, 
	CreateFriendParams, 
	FriendRequestParams, 
} from "src/utils/types";

export interface IFriendRequestService {
	accept(params: FriendRequestParams): Promise<AcceptFriendRequestResponse>;
	cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
	create(params: CreateFriendParams);
	reject(params: CancelFriendRequestParams): Promise<FriendRequest>;
	getFriendRequests(userId: number): Promise<FriendRequest[]>;
	isFriends(userOneId: number, userTwoId: number);
	isPending(userOneId: number, userTwoId: number);
	findById(id: number): Promise<FriendRequest>;
}
