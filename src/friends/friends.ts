import { Friend } from "src/utils/typeorm";

export interface IFriendsService {
	getFriends(id: number): Promise<Friend[]>;
}