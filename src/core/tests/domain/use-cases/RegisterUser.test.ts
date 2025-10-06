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
    };
    registerUser = new RegisterUser(mockUserRepository);
  });

  it('should register a new user successfully', async () => {
    const id = '1';
    const nameValue = 'Test User';
    const emailValue = 'test@example.com';
    const passwordValue = 'password123';

    const expectedUser = User.create(
      id,
      Name.create(nameValue),
      Email.create(emailValue),
      Password.create(passwordValue)
    );

    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await registerUser.execute(id, nameValue, emailValue, passwordValue);

    expect(result).toEqual(expectedUser);
    expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUser);
  });

  it('should throw an error if name is invalid', async () => {
    const id = '1';
    const nameValue = ''; // Invalid name
    const emailValue = 'test@example.com';
    const passwordValue = 'password123';

    await expect(registerUser.execute(id, nameValue, emailValue, passwordValue)).rejects.toThrow('Invalid name');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if email is invalid', async () => {
    const id = '1';
    const nameValue = 'Test User';
    const emailValue = 'invalid-email'; // Invalid email
    const passwordValue = 'password123';

    await expect(registerUser.execute(id, nameValue, emailValue, passwordValue)).rejects.toThrow('Invalid email');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if a user with the same email already exists', async () => {
    const id = '1';
    const nameValue = 'Test User';
    const emailValue = 'existing@example.com';
    const passwordValue = 'password123';

    const existingUser = User.create(
      'existingId',
      Name.create('Existing User'),
      Email.create(emailValue),
      Password.create(passwordValue)
    );

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(registerUser.execute(id, nameValue, emailValue, passwordValue)).rejects.toThrow('User with this email already exists');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
