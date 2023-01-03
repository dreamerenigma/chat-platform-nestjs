import { Inject, Injectable } from "@nestjs/common";
import { Services } from "src/utils/constants";
import { IImageStorageService  } from './image-storage';
import { S3 } from '@aws-sdk/client-s3';
import { UploadImageParams } from "src/utils/types";

@Injectable()
export class ImageStorageService implements IImageStorageService  {
   constructor(
      @Inject(Services.SPACES_CLIENT)
      private readonly spacesClient: S3,
   ) {}

   upload(params: UploadImageParams) {
      return this.spacesClient.putObject({
         Bucket: 'dialogchat',
         Key: params.key,
         Body: params.file.buffer,
         ACL: 'public-read',
         ContentType: params.file.mimetype,
      });
   }

   uploadProfilePicture() {
      throw new Error("Method not implemented.");
   }

   deleteBanner() {
      throw new Error("Method not implemented.");
   }
   
   deleteProfilePicture() {
      throw new Error("Method not implemented.");
   }
}