import { IUserRepository } from '../domain/repositories/IUserRepository';
import { LoginUser } from '../domain/use-cases/LoginUser';
import { RegisterUser } from '../domain/use-cases/RegisterUser';
import { MockUserRepository } from '../infra/repositories/MockUserRepository';

export function makeUserUseCases() {
  const userRepository: IUserRepository = new MockUserRepository();

  const loginUser = new LoginUser(userRepository);
  const registerUser = new RegisterUser(userRepository);

  return {
    loginUser,
    registerUser,
  };
}
