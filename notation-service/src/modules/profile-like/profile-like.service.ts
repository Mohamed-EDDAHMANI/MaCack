import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileLike, ProfileLikeDocument } from './schemas/profile-like.schema';
import { ServiceError } from '../../common/exceptions';
import { successPayload } from '../../common/types/response-helpers';

@Injectable()
export class ProfileLikeService {
  private readonly logger = new Logger(ProfileLikeService.name);

  constructor(
    @InjectModel(ProfileLike.name) private readonly profileLikeModel: Model<ProfileLikeDocument>,
  ) {}

  async toggle(userId: string, patissiereId: string) {
    try {
      if (userId === patissiereId) {
        return new ServiceError('VALIDATION_ERROR', 'You cannot like your own profile', 400);
      }

      const existing = await this.profileLikeModel.findOne({ userId, patissiereId }).exec();

      if (existing) {
        await this.profileLikeModel.deleteOne({ _id: existing._id }).exec();
        const count = await this.profileLikeModel.countDocuments({ patissiereId }).exec();
        return successPayload('Profile unliked', { liked: false, count });
      }

      await this.profileLikeModel.create({ userId, patissiereId });
      const count = await this.profileLikeModel.countDocuments({ patissiereId }).exec();
      return successPayload('Profile liked', { liked: true, count });
    } catch (error) {
      this.logger.error(`Failed to toggle profile like: ${error?.message}`);
      return new ServiceError(
        'INTERNAL_SERVER_ERROR',
        error?.message || 'Failed to toggle profile like',
        500,
      );
    }
  }

  async getCount(patissiereId: string) {
    try {
      const count = await this.profileLikeModel.countDocuments({ patissiereId }).exec();
      return successPayload('Profile like count fetched', { patissiereId, count });
    } catch (error) {
      return new ServiceError(
        'INTERNAL_SERVER_ERROR',
        error?.message || 'Failed to get profile like count',
        500,
      );
    }
  }

  async hasLiked(userId: string, patissiereId: string) {
    try {
      const exists = await this.profileLikeModel.exists({ userId, patissiereId }).exec();
      return successPayload('Profile like check result', { liked: !!exists });
    } catch (error) {
      return new ServiceError(
        'INTERNAL_SERVER_ERROR',
        error?.message || 'Failed to check profile like',
        500,
      );
    }
  }
}
