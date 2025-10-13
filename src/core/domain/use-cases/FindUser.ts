import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class FindUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    // Em uma aplicação real, isso buscaria o usuário por ID no banco de dados
    return this.userRepository.findById(userId);
  }
}
