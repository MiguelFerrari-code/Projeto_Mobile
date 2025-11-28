import { IUserRepository, AuthCredentials, SignUpPayload, UpdateUserPayload } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { Name } from "../../domain/value-objects/Name";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";

export class MockUserRepository implements IUserRepository {
  private static instance: MockUserRepository;
  private users: User[] = [];
  private currentUser: User | null = null;

  public static getInstance(): MockUserRepository {
    if (!MockUserRepository.instance) {
      MockUserRepository.instance = new MockUserRepository();
    }
    return MockUserRepository.instance;
  }

  public reset(): void {
    this.users = [];
    this.currentUser = null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.value === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
  }

  async loginUser({ email, password }: AuthCredentials): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user || user.password.value !== password) {
      throw new Error('Falha ao autenticar usuario: credenciais invalidas');
    }

    this.currentUser = user;
    return user;
  }

  async signUpUser({ name, email, password }: SignUpPayload): Promise<User> {
    const existing = await this.findByEmail(email);

    if (existing) {
      throw new Error('Ja existe um usuario com este email.');
    }

    const user = User.create(
      (this.users.length + 1).toString(),
      Name.create(name ?? 'User'),
      Email.create(email),
      Password.create(password),
      undefined,
      null,
      null
    );

    await this.save(user);
    this.currentUser = user;
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async updateUser(userId: string, data: UpdateUserPayload): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('Usuario nao encontrado para atualizacao.');
    }

    const updatedUser = User.create(
      user.id,
      data.name ? Name.create(data.name) : user.name,
      data.email ? Email.create(data.email) : user.email,
      data.password ? Password.create(data.password) : user.password,
      data.avatarUrl !== undefined ? data.avatarUrl ?? undefined : user.avatarUrl,
      data.latitude !== undefined ? data.latitude : user.latitude ?? null,
      data.longitude !== undefined ? data.longitude : user.longitude ?? null
    );

    await this.update(updatedUser);
    this.currentUser = this.currentUser?.id === userId ? updatedUser : this.currentUser;
    return updatedUser;
  }
}
