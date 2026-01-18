import {
  type ListUsersQuery,
  type ListUsersResponse,
} from '@api/routes/users/list-users/list-users.schema';
import { UserApplication } from '@applications/user/user.application';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export const listUsersHandler = async (
  params: ListUsersQuery
): Promise<ListUsersResponse> => {
  const userApplication = new UserApplication();
  const users = await userApplication.listUsers({
    limit: params.limit ?? DEFAULT_LIMIT,
    offset: params.offset ?? DEFAULT_OFFSET,
  });
  return { users };
};
