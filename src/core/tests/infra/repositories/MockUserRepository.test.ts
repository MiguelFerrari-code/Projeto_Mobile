import { MockUserRepository } from '../../../infra/repositories/MockUserRepository';
import { User } from '../../../domain/entities/User';
import { Name } from '../../../domain/value-objects/Name';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

describe('MockUserRepository', () => {
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
  });

  it('should save a user', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    await repository.save(user);

    const found = await repository.findById('1');
    expect(found).toEqual(user);
  });

  it('should find a user by email', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    await repository.save(user);

    const found = await repository.findByEmail('test@example.com');
    expect(found).toEqual(user);
  });

  it('should find a user by id', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    await repository.save(user);

    const found = await repository.findById('1');
    expect(found).toEqual(user);
  });

  it('should update a user', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    await repository.save(user);

    const updatedName = Name.create('Updated User');
    const updatedUser = User.create('1', updatedName, email, password);
    await repository.update(updatedUser);

    const found = await repository.findById('1');
    expect(found?.name.value).toBe('Updated User');
  });

  it('should delete a user', async () => {
    const name = Name.create('Test User');
    const email = Email.create('test@example.com');
    const password = Password.create('password123');
    const user = User.create('1', name, email, password);

    await repository.save(user);
    await repository.delete('1');

    const found = await repository.findById('1');
    expect(found).toBeNull();
  });
});
