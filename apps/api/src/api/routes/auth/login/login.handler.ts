import { LoginRequest } from '@api/routes/auth/login/login.schema';
import { AuthApplication } from '@applications/auth/auth.application';

export const loginHandler = async (params: LoginRequest) => {
  const authApplication = new AuthApplication();
  const user = await authApplication.login(params.email, params.password);
  return user.values;
};
