import { IUserRepository, UpdateUserPayload } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: UpdateUserPayload): Promise<User> {
    return this.userRepository.updateUser(userId, data);
  }
}
