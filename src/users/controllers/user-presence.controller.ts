import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { IUserPresenceService } from './../../../dist/chat-app-nestjs/src/users/interfaces/user-presence.d';
import { Body, Controller, Inject, Patch, UseGuards } from "@nestjs/common";
import { AuthUser } from "../../utils/decorators";
import { Routes, Services } from "../../utils/constants";
import { User } from "../../utils/typeorm";
import { UpdatePresenceStatusDto } from "../dtos/UpdatePresenceStatus.dto";

@UseGuards(AuthenticatedGuard)
@Controller(Routes.USER_PRESENCE)
export class UserPresenceController {
   constructor(
      @Inject(Services.USER_PRESENCE)
      private readonly userPresenceService: IUserPresenceService,
   ) {}

   @Patch('status')
   updateStatus(
      @AuthUser() user: User, 
      @Body() { statusMessage }: UpdatePresenceStatusDto, 
   ) {
      return this.userPresenceService.updateStatus({ user, statusMessage });
   }
}
