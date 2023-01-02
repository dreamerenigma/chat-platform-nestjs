import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { Routes, Services } from "src/utils/constants";
import { IUserService } from "./user";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { UserProfileDto } from "./dtos/UserProfile";
import { UserAlreadyExists } from './exceptions/UserAlreadyExists';

@Controller(Routes.USERS)
export class UsersController {
	constructor(
		@Inject(Services.USERS) private readonly userService: IUserService,
	) { }

	@Get('search')
	searchUsers(@Query('query') query: string) {
		console.log(query);
		if (!query)
			throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
		return this.userService.searchUsers(query);
	}

	@Post('profiles')
	@UseInterceptors(FileInterceptor('file'))
	async completeProfile(
		@UploadedFile() file: Express.Multer.File,
		@Body() userProfileDto: UserProfileDto,
	) {
		console.log(file);
		console.log(userProfileDto.about, userProfileDto.username);
	}

	@Get('check')
	async checkUsername(@Query('username') username: string) {
		if(!username) 
			throw new HttpException('Invalid Query', HttpStatus.BAD_REQUEST);
		const user = await this.userService.findUser({ username });
		if (user) throw new UserAlreadyExists();
		return HttpStatus.OK;
	}
}
