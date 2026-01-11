import { RequestUser } from '@api/middlewares/access-token.middleware';
import { UserNotFoundApiError } from '@api/lib/errors/exceptions';
import { UserApplication } from '@applications/user/user.application';

export const meHandler = async (user: RequestUser) => {
  const userApplication = new UserApplication();
  const userEntity = await userApplication.findUserById(user.id);
  if (!userEntity) throw new UserNotFoundApiError(user.id);
  return userEntity.values;
};
