import { ContentfulStatusCode } from 'hono/utils/http-status';

export abstract class ApiError extends Error {
  abstract code: string;
  abstract statusCode: ContentfulStatusCode;
}

export class NotFoundTokenApiError extends ApiError {
  public code: string = 'NOT_FOUND_TOKEN_API';
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class InvalidTokenApiError extends Error implements ApiError {
  public code: string = 'INVALID_TOKEN_API';
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class ExpiredTokenApiError extends Error implements ApiError {
  public code: string = 'EXPIRED_TOKEN_API';
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('アクセストークンが期限切れです');
    this.name = this.constructor.name;
  }
}

export class InvalidUserApiError extends Error implements ApiError {
  public code: string = 'INVALID_USER_API';
  public statusCode: ContentfulStatusCode = 401;
  constructor() {
    super('ユーザーに権限がありません');
    this.name = this.constructor.name;
  }
}

export class UserNotFoundApiError extends Error implements ApiError {
  public code: string = 'USER_NOT_FOUND_API';
  public statusCode: ContentfulStatusCode = 404;
  constructor(userId: string) {
    super(`ユーザーが見つかりませんでした id:${userId}`);
    this.name = this.constructor.name;
  }
}
