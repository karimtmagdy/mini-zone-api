import { UserRepository } from "../../../../../../repositories";
import { User } from "../models/user.model";

// ─── User Service ──────────────────────────────────────────────────────────

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async getByEmail(email: string): Promise<User | null> {
    const doc = await this.repo.findByEmail(email);
    return doc ? new User(doc) : null;
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const doc = await this.repo.findByEmail(email);
    if (!doc) throw new Error("Invalid credentials");

    const valid = await doc.comparePassword(password);
    if (!valid) throw new Error("Invalid credentials");

    await this.repo.updateLastLogin(doc._id.toString());
    return new User(doc);
  }
}
