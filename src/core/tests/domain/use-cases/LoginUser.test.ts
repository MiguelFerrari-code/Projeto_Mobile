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
    };
    loginUser = new LoginUser(mockUserRepository);
  });

  it('should return the user if login is successful', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    mockUserRepository.findByEmail.mockResolvedValue(user);

    const result = await loginUser.execute('test@example.com', 'password123');

    expect(result).toEqual(user);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should return null if user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const result = await loginUser.execute('nonexistent@example.com', 'password123');

    expect(result).toBeNull();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });

  it('should return null if password is incorrect', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    mockUserRepository.findByEmail.mockResolvedValue(user);

    const result = await loginUser.execute('test@example.com', 'wrongpassword');

    expect(result).toBeNull();
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw an error for invalid email format', async () => {
    await expect(loginUser.execute('invalid-email', 'password123')).rejects.toThrow('Invalid email');
  });

  it('should throw an error for invalid password format', async () => {
    await expect(loginUser.execute('test@example.com', 'short')).rejects.toThrow('Invalid password');
  });
});
