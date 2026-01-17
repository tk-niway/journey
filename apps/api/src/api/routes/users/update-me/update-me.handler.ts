import { RequestUser } from '@api/middlewares/access-token.middleware';
import {
  type UpdateMeRequest,
  type UpdateMeResponse,
} from '@api/routes/users/update-me/update-me.schema';
import { UserApplication } from '@applications/user/user.application';

export const updateMeHandler = async (
  user: RequestUser,
  params: UpdateMeRequest
): Promise<UpdateMeResponse> => {
  const userApplication = new UserApplication();
  const updatedUser = await userApplication.updateUser(user.id, params);
  return updatedUser.values;
};
