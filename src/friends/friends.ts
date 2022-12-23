import { Friend } from "src/utils/typeorm";
import { DeleteFriendRequestParams } from "src/utils/types";

export interface IFriendsService {
	getFriends(id: number): Promise<Friend[]>;
	findFriendById(id: number): Promise<Friend>;
	deleteFriend(params: DeleteFriendRequestParams);
	isFriends(userOneId: number, userTwoId: number): Promise<Friend | undefined>;
}

