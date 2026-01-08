import { databaseService, DatabaseService } from "@db/database.service";
import { CreateUserInput } from "@domains/user/types/user.type";
import { UserApplication } from "../user/user.application";
import { hashPassword } from "@lib/password-hasher";

export class AuthApplication {
  constructor(dbService: DatabaseService = databaseService) {
    this.userApp = new UserApplication(dbService);
  }
  private userApp: UserApplication;

  async signup(input: CreateUserInput) {
    const hashedPassword = hashPassword(input.password);

    const user = await this.userApp.createUser({ ...input, password: hashedPassword });

    return user.values;
  }

  async login() { }

  async logout() { }


}