import { User } from '../../../domain/entities/User';
import { Name } from '../../../domain/value-objects/Name';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

describe('User Entity', () => {
  it('should create a user with valid data', () => {
    const id = '123';
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');

    const user = User.create(id, name, email, password);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(id);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
  });
});
