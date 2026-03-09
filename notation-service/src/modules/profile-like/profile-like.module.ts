import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProfileLike,
  ProfileLikeSchema,
} from './schemas/profile-like.schema';
import { ProfileLikeService } from './profile-like.service';
import { ProfileLikeController } from './profile-like.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProfileLike.name, schema: ProfileLikeSchema },
    ]),
  ],
  controllers: [ProfileLikeController],
  providers: [ProfileLikeService],
  exports: [ProfileLikeService],
})
export class ProfileLikeModule {}
