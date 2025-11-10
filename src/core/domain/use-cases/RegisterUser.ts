import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";
import { Name } from "../value-objects/Name";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
};

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: RegisterUserParams): Promise<User> {
    const parsedName = Name.create(name);
    const parsedEmail = Email.create(email);
    const parsedPassword = Password.create(password);

    return this.userRepository.signUpUser({
      name: parsedName.value,
      email: parsedEmail.value,
      password: parsedPassword.value,
    });
  }
}
