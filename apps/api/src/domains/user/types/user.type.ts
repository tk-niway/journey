export interface UserType {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewUserType = Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateUserInput {
  name: string;
  email: string;
  password:string;
}