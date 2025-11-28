import { Email } from '../value-objects/Email';
import { Name } from '../value-objects/Name';
import { Password } from '../value-objects/Password';

export class User {
  private constructor(
    readonly id: string,
    readonly name: Name,
    readonly email: Email,
    readonly password: Password,
    readonly avatarUrl?: string,
    readonly latitude?: number | null,
    readonly longitude?: number | null
  ) {}

  static create(
    id: string,
    name: Name,
    email: Email,
    password: Password,
    avatarUrl?: string,
    latitude?: number | null,
    longitude?: number | null
  ): User {
    return new User(id, name, email, password, avatarUrl, latitude, longitude);
  }
}
