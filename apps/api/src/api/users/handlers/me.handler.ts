import { RequestUser } from '@api/common/middlewares/access-token-handler';
import { UserApiUserNotFoundError } from '@api/users/errors/user-api.error';
import { UserApplication } from '@applications/user/user.application';

export const meHandler = async (user: RequestUser) => {
  const userApplication = new UserApplication();
  const userEntity = await userApplication.findUserById(user.id);
  if (!userEntity) throw new UserApiUserNotFoundError(user.id);
  return userEntity.values;
};
