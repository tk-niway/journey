export class NotFoundTokenError extends Error {
  public code: string = 'NOT_FOUND_TOKEN';
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class InvalidTokenError extends Error {
  public code: string = 'INVALID_TOKEN';
  constructor() {
    super('アクセストークンが無効です');
    this.name = this.constructor.name;
  }
}

export class ExpiredTokenError extends Error {
  public code: string = 'EXPIRED_TOKEN';
  constructor() {
    super('アクセストークンが期限切れです');
    this.name = this.constructor.name;
  }
}

export class InvalidUserError extends Error {
  public code: string = 'INVALID_USER';
  constructor() {
    super('ユーザーに権限がありません');
    this.name = this.constructor.name;
  }
}
