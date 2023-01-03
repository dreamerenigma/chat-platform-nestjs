import { User } from 'src/utils/typeorm';
import { UpdateUserProfileParams } from 'src/utils/types';
export interface IUserProfile {
   createProfile();
   updateProfile(user: User, params: UpdateUserProfileParams);
   createProfileOrUpdate(user: User, params: UpdateUserProfileParams);
}
