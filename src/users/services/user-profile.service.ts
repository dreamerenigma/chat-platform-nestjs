import { Injectable } from "@nestjs/common";
import { IUserProfile } from "../interfaces/user-profile";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/utils/typeorm";
import { Repository } from "typeorm";
import { UpdateUserProfileParams } from "src/utils/types";

@Injectable()
export class UserProfileService implements IUserProfile {
   constructor(
      @InjectRepository(Profile) 
      private readonly profieRespository: Repository<Profile>,
   ) {}
   findProfile() {
      throw new Error('Method not implemented.');
   }

   updateProfile(params: UpdateUserProfileParams) {}
}
