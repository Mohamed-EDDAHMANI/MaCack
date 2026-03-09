import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ProfileLikeService } from './profile-like.service';
import { ServiceError } from '../../common/exceptions';
import { NOTATION_PATTERNS } from '../../messaging/constants';

@Controller()
export class ProfileLikeController {
  constructor(private readonly profileLikeService: ProfileLikeService) {}

  @MessagePattern(NOTATION_PATTERNS.PROFILE_LIKE_TOGGLE)
  async toggle(data: any) {
    const rawUserId = data?.body?.userId ?? data?.user?.sub ?? data?.user?.id;
    const rawPatissiereId = data?.body?.patissiereId;
    const userId = rawUserId != null ? String(rawUserId) : '';
    const patissiereId = rawPatissiereId != null ? String(rawPatissiereId) : '';
    if (!userId || !patissiereId) {
      throw new RpcException({
        statusCode: 400,
        message: 'userId and patissiereId are required',
      });
    }
    const result = await this.profileLikeService.toggle(userId, patissiereId);
    if (result instanceof ServiceError) throw new RpcException(result.toJSON());
    return result;
  }

  @MessagePattern(NOTATION_PATTERNS.PROFILE_LIKE_COUNT)
  async getCount(data: any) {
    const patissiereId =
      data?.body?.patissiereId || data?.params?.id || data?.query?.patissiereId;
    const result = await this.profileLikeService.getCount(patissiereId);
    if (result instanceof ServiceError) throw new RpcException(result.toJSON());
    return result;
  }

  @MessagePattern(NOTATION_PATTERNS.PROFILE_LIKE_CHECK)
  async hasLiked(data: any) {
    const userId = data?.body?.userId || data?.query?.userId;
    const patissiereId = data?.body?.patissiereId || data?.query?.patissiereId;
    const result = await this.profileLikeService.hasLiked(userId, patissiereId);
    if (result instanceof ServiceError) throw new RpcException(result.toJSON());
    return result;
  }
}
