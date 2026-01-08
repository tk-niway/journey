import { AuthApplication } from "../../../applications/auth/auth.application";
import { SignupRequest } from "../schemas/signup.schema";

export const signupHandler = async (params: SignupRequest) => {
  const authApplication = new AuthApplication();

  const user = await authApplication.signup(params);

  return user;
};