import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    // Em uma aplicação real, isso excluiria o usuário do banco de dados
    return this.userRepository.delete(userId);
  }
}