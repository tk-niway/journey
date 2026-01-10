export class UserApiUserNotFoundError extends Error {
  public code: string = 'USER_NOT_FOUND';
  constructor(userId: string) {
    super(`ユーザーが見つかりませんでした id:${userId}`);
    this.name = this.constructor.name;
  }
}
