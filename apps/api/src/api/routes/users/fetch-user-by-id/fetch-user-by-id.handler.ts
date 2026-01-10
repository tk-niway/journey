import type {
  FetchUserByIdRequest,
  FetchUserByIdResponse,
} from '@api/routes/users/fetch-user-by-id/fetch-user-by-id.schema';
import { UserApplication } from '@applications/user/user.application';
import { UserNotFoundApiError } from '@api/errors';

export const fetchUserByIdHandler = async (
  params: FetchUserByIdRequest
): Promise<FetchUserByIdResponse> => {
  const userApplication = new UserApplication();

  const user = await userApplication.findUserById(params.id);

  if (!user) {
    throw new UserNotFoundApiError(params.id);
  }

  return user.values;
};
