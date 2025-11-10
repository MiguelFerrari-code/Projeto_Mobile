import { IUserRepository } from "../repositories/IUserRepository";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { User } from "../entities/User";

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(emailValue: string, passwordValue: string): Promise<User | null> {
    const email = Email.create(emailValue);
    const password = Password.create(passwordValue);

    try {
      return await this.userRepository.loginUser({
        email: email.value,
        password: password.value,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Falha ao autenticar usuario')) {
        return null;
      }

      throw error;
    }
  }
}
