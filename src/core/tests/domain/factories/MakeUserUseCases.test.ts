import { makeUserUseCases } from '../../../factories/MakeUserUseCases';
import { LoginUser } from '../../../domain/use-cases/LoginUser';
import { RegisterUser } from '../../../domain/use-cases/RegisterUser';
import { LogoutUser } from '../../../domain/use-cases/LogoutUser';
import { UpdateUser } from '../../../domain/use-cases/UpdateUser';
import { DeleteUser } from '../../../domain/use-cases/DeleteUser';
import { FindUser } from '../../../domain/use-cases/FindUser';
import { MockUserRepository } from '../../../infra/repositories/MockUserRepository';

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

  it('should instantiate RegisterUser with MockUserRepository', () => {
    const useCases = makeUserUseCases();
    expect(useCases.registerUser).toBeInstanceOf(RegisterUser);
  });

  it('should instantiate LoginUser with MockUserRepository', () => {
    const useCases = makeUserUseCases();
    expect(useCases.loginUser).toBeInstanceOf(LoginUser);
  });

  it('should instantiate LogoutUser', () => {
    const useCases = makeUserUseCases();
    expect(useCases.logoutUser).toBeInstanceOf(LogoutUser);
  });

  it('should instantiate UpdateUser with MockUserRepository', () => {
    const useCases = makeUserUseCases();
    expect(useCases.updateUser).toBeInstanceOf(UpdateUser);
  });

  it('should instantiate DeleteUser with MockUserRepository', () => {
    const useCases = makeUserUseCases();
    expect(useCases.deleteUser).toBeInstanceOf(DeleteUser);
  });

  it('should instantiate FindUser with MockUserRepository', () => {
    const useCases = makeUserUseCases();
    expect(useCases.findUser).toBeInstanceOf(FindUser);
  });

  it('should use the same instance of MockUserRepository for use cases that require it', () => {
    const useCases = makeUserUseCases();
    const mockRepoInstance = new MockUserRepository(); // For type comparison

    // Check if the repository is an instance of MockUserRepository
    expect(useCases.registerUser['userRepository']).toBeInstanceOf(MockUserRepository);
    expect(useCases.loginUser['userRepository']).toBeInstanceOf(MockUserRepository);
    expect(useCases.updateUser['userRepository']).toBeInstanceOf(MockUserRepository);
    expect(useCases.deleteUser['userRepository']).toBeInstanceOf(MockUserRepository);
    expect(useCases.findUser['userRepository']).toBeInstanceOf(MockUserRepository);

    // Verify they are the *same* instance
    const repoFromRegister = useCases.registerUser['userRepository'];
    expect(useCases.loginUser['userRepository']).toBe(repoFromRegister);
    expect(useCases.updateUser['userRepository']).toBe(repoFromRegister);
    expect(useCases.deleteUser['userRepository']).toBe(repoFromRegister);
    expect(useCases.findUser['userRepository']).toBe(repoFromRegister);
  });
});

