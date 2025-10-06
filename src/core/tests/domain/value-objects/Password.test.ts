import { Password } from '../../../domain/value-objects/Password';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const password = Password.create('password123');
    expect(password).toBeInstanceOf(Password);
    expect(password.value).toBe('password123');
  });

  it('should throw an error for an invalid password', () => {
    expect(() => Password.create('12345')).toThrow('Invalid password');
  });
});
