import { UploadImageParams } from "src/utils/types";

export interface IImageStorageService {
   upload(params: UploadImageParams);
   uploadProfilePicture();

   deleteBanner();
   deleteProfilePicture();
}
