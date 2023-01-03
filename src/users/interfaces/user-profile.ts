import { UpdateUserProfileParams } from 'src/utils/types';
import { UpdateUserProfileDto } from './../dtos/UpdateUserProfile.dto';
export interface IUserProfile {
   findProfile();
   updateProfile(params: UpdateUserProfileParams);
}
