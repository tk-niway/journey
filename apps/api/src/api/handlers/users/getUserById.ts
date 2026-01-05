import type { GetUserRequest, GetUserResponse } from "../../schemas/users";

export const getUserById = (params: GetUserRequest): GetUserResponse => {
  return {
    id: params.id,
    name: 'John Doe',
    age: 42
  };
};