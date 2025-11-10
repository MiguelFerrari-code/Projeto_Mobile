export class Password {
  private constructor(readonly value: string) {}

  static create(password: string): Password {
    const normalized = password.trim();

    if (!this.validate(normalized)) {
      throw new Error("Invalid password");
    }

    return new Password(normalized);
  }

  private static validate(password: string): boolean {
    return password.length >= 6;
  }
}
