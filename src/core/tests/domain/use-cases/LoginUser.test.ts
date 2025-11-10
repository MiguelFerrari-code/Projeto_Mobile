import { LoginUser } from '../../../domain/use-cases/LoginUser';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';
import { Name } from '../../../domain/value-objects/Name';

describe('LoginUser', () => {
  let loginUser: LoginUser;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      loginUser: jest.fn(),
      signUpUser: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      updateUser: jest.fn(),
    };
    loginUser = new LoginUser(mockUserRepository);
  });

  it('should return the user if login is successful', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    mockUserRepository.loginUser.mockResolvedValue(user);

    const result = await loginUser.execute('test@example.com', 'password123');

    expect(result).toEqual(user);
    expect(mockUserRepository.loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should return null if credentials are invalid', async () => {
    mockUserRepository.loginUser.mockRejectedValue(
      new Error('Falha ao autenticar usuario: Invalid login credentials')
    );

    const result = await loginUser.execute('nonexistent@example.com', 'password123');

    expect(result).toBeNull();
  });

  it('should throw other repository errors', async () => {
    mockUserRepository.loginUser.mockRejectedValue(new Error('Unexpected error'));

    await expect(loginUser.execute('test@example.com', 'password123')).rejects.toThrow(
      'Unexpected error'
    );
  });

  it('should throw an error for invalid email format', async () => {
    await expect(loginUser.execute('invalid-email', 'password123')).rejects.toThrow('Invalid email');
  });

  it('should throw an error for invalid password format', async () => {
    await expect(loginUser.execute('test@example.com', 'short')).rejects.toThrow('Invalid password');
  });
});
