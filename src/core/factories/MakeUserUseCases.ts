import { IUserRepository } from '../domain/repositories/IUserRepository';
import { LoginUser } from '../domain/use-cases/LoginUser';
import { RegisterUser } from '../domain/use-cases/RegisterUser';
import { LogoutUser } from '../domain/use-cases/LogoutUser';
import { UpdateUser } from '../domain/use-cases/UpdateUser';
import { DeleteUser } from '../domain/use-cases/DeleteUser';
import { FindUser } from '../domain/use-cases/FindUser';
import { MockUserRepository } from '../infra/repositories/MockUserRepository';

export function makeUserUseCases() {
  const userRepository: IUserRepository = new MockUserRepository();

  const registerUser = new RegisterUser(userRepository);
  const loginUser = new LoginUser(userRepository);
  const logoutUser = new LogoutUser();
  const updateUser = new UpdateUser(userRepository);
  const deleteUser = new DeleteUser(userRepository);
  const findUser = new FindUser(userRepository);

  return {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    findUser,
  };
}
