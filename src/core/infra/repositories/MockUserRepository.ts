import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class MockUserRepository implements IUserRepository {
  private static instance: MockUserRepository;
  private users: User[] = [];
    public static getInstance(): MockUserRepository {
    if (!MockUserRepository.instance) {
      MockUserRepository.instance = new MockUserRepository();
    }
    return MockUserRepository.instance;
  }

    public reset(): void {
    this.users = [];
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
}

