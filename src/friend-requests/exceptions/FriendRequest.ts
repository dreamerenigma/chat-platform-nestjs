import { HttpStatus } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

export class FriendRequestException extends HttpException {
	constructor() {
		super('Cannot accept friend request', HttpStatus.BAD_REQUEST);
	}
}