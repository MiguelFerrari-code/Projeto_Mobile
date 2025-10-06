import { IUserRepository } from "../repositories/IUserRepository";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { User } from "../entities/User";

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(emailValue: string, passwordValue: string): Promise<User | null> {
    const email = Email.create(emailValue);
    const password = Password.create(passwordValue);

    const user = await this.userRepository.findByEmail(email.value);

    if (user && user.password.value === password.value) {
      return user;
    }
    return null;
  }
}

