import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<void> {
    // Em uma aplicação real, isso atualizaria o usuário no banco de dados
    return this.userRepository.update(user);
  }
}
