import { IUserRepository } from "../repositories/IUserRepository";

export class LogoutUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<void> {
    await this.userRepository.signOut();
  }
}
