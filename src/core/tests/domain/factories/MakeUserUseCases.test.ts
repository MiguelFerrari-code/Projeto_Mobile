import { makeUserUseCases } from '../../../factories/MakeUserUseCases';
import { LoginUser } from '../../../domain/use-cases/LoginUser';
import { RegisterUser } from '../../../domain/use-cases/RegisterUser';
import { LogoutUser } from '../../../domain/use-cases/LogoutUser';
import { UpdateUser } from '../../../domain/use-cases/UpdateUser';
import { DeleteUser } from '../../../domain/use-cases/DeleteUser';
import { FindUser } from '../../../domain/use-cases/FindUser';

describe('makeUserUseCases', () => {
  it('should return an object with all user use cases', () => {
    const useCases = makeUserUseCases();

    expect(useCases).toHaveProperty('registerUser');
    expect(useCases).toHaveProperty('loginUser');
    expect(useCases).toHaveProperty('logoutUser');
    expect(useCases).toHaveProperty('updateUser');
    expect(useCases).toHaveProperty('deleteUser');
    expect(useCases).toHaveProperty('findUser');
  });

  it('should instantiate RegisterUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.registerUser).toBeInstanceOf(RegisterUser);
  });

  it('should instantiate LoginUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.loginUser).toBeInstanceOf(LoginUser);
  });

  it('should instantiate LogoutUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.logoutUser).toBeInstanceOf(LogoutUser);
  });

  it('should instantiate UpdateUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.updateUser).toBeInstanceOf(UpdateUser);
  });

  it('should instantiate DeleteUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.deleteUser).toBeInstanceOf(DeleteUser);
  });

  it('should instantiate FindUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.findUser).toBeInstanceOf(FindUser);
  });

});
