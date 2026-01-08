import type { FetchUserByIdRequest, FetchUserByIdResponse } from "../schemas/fetch-user-by-id.schema";
import { UserApplication } from "../../../applications/user/user.application";
import { HTTPException } from "hono/http-exception";

export const fetchUserByIdHandler = async (params: FetchUserByIdRequest): Promise<FetchUserByIdResponse> => {
  const userApplication = new UserApplication();

  const user = await userApplication.findUserById(params.id);

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return user.values;
};