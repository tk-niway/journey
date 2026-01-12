import { ApiError } from '@lib/errors/api-error.abstract';
import { ErrorCode } from '@shared/error-code.const';
import { ContentfulStatusCode } from '@lib/errors/http-status.const';

export class NotFoundTokenApiError extends ApiError {
  public code: ErrorCode = ErrorCode.TOKEN_NOT_FOUND;
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class InvalidTokenApiError extends ApiError {
  public code: ErrorCode = ErrorCode.TOKEN_INVALID;
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class ExpiredTokenApiError extends ApiError {
  public code: ErrorCode = ErrorCode.TOKEN_EXPIRED;
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが期限切れです');
    this.name = this.constructor.name;
  }
}

export class InvalidUserApiError extends ApiError {
  public code: ErrorCode = ErrorCode.USER_INVALID;
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('ユーザーに権限がありません');
    this.name = this.constructor.name;
  }
}

export class UserNotFoundApiError extends ApiError {
  public code: ErrorCode = ErrorCode.USER_NOT_FOUND;
  public statusCode: ContentfulStatusCode = 404;
  constructor(userId: string) {
    super(`ユーザーが見つかりませんでした id:${userId}`);
    this.name = this.constructor.name;
  }
}
