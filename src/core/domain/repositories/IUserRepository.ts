import { User } from '../entities/User';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpPayload = AuthCredentials & {
  name?: string;
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string | null;
};

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;

  loginUser(data: AuthCredentials): Promise<User>;
  signUpUser(data: SignUpPayload): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateUser(userId: string, data: UpdateUserPayload): Promise<User>;
}
