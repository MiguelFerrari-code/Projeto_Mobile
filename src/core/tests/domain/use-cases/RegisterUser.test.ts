import { RegisterUser } from '../../../domain/use-cases/RegisterUser';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Name } from '../../../domain/value-objects/Name';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
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
    registerUser = new RegisterUser(mockUserRepository);
  });

  it('should register a new user successfully', async () => {
    const nameValue = 'Test User';
    const emailValue = 'test@example.com';
    const passwordValue = 'password123';

    const expectedUser = User.create(
      'generated-id',
      Name.create(nameValue),
      Email.create(emailValue),
      Password.create(passwordValue)
    );

    mockUserRepository.signUpUser.mockResolvedValue(expectedUser);

    const result = await registerUser.execute({
      name: nameValue,
      email: emailValue,
      password: passwordValue,
    });

    expect(result).toEqual(expectedUser);
    expect(mockUserRepository.signUpUser).toHaveBeenCalledWith({
      name: nameValue,
      email: emailValue,
      password: passwordValue,
    });
  });

  it('should throw an error if name is invalid', async () => {
    await expect(
      registerUser.execute({ name: '', email: 'test@example.com', password: 'password123' })
    ).rejects.toThrow('Invalid name');
    expect(mockUserRepository.signUpUser).not.toHaveBeenCalled();
  });

  it('should throw an error if email is invalid', async () => {
    await expect(
      registerUser.execute({ name: 'Test', email: 'invalid-email', password: 'password123' })
    ).rejects.toThrow('Invalid email');
    expect(mockUserRepository.signUpUser).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    mockUserRepository.signUpUser.mockRejectedValue(new Error('Repository error'));

    await expect(
      registerUser.execute({ name: 'Test', email: 'test@example.com', password: 'password123' })
    ).rejects.toThrow('Repository error');
  });
});
