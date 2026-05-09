export class User {
  constructor(
    public username: string,
    public email: string,
    public password: string
  ) {}

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
