export class Email {
  private constructor(readonly value: string) {}

  static create(email: string): Email {
    const normalized = email.trim().toLowerCase();

    if (!this.validate(normalized)) {
      throw new Error("Invalid email");
    }

    return new Email(normalized);
  }

  private static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
