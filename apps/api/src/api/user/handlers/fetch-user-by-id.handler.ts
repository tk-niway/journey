import type { FetchUserByIdRequest, FetchUserByIdResponse } from "../schemas/fetch-user-by-id.schema";
import { UserApplication } from "../../../applications/user/user.application";
import { UserApiUserNotFoundError } from "../errors/user-api.error";

export const fetchUserByIdHandler = async (params: FetchUserByIdRequest): Promise<FetchUserByIdResponse> => {
  const userApplication = new UserApplication();

  const user = await userApplication.findUserById(params.id);

  if (!user) {
    throw new UserApiUserNotFoundError(params.id);
  }

  return user.values;
};