export class Login {
  public email!: string;
  public password!: string;
  constructor(data: Partial<Login>) {
    Object.assign(this, data);
  }
}
