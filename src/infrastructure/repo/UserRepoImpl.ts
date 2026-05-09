import { UserRepository } from "@/domain/interface/UserRepository";
import { User } from "@/domain/entities/User";
import { UserModel } from "@/infrastructure/database/userModel";

export class UserRepoImpl implements UserRepository {
  async create(user: User): Promise<User> {
    const doc = await UserModel.create({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    return new User(
      doc.username as string,
      doc.email as string,
      doc.password as string,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc
      ? new User(
          doc.username as string,
          doc.email as string,
          doc.password as string,
        )
      : null;
  }
}
