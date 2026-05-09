import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/interface/UserRepository";
import { AppError } from "@/shared/utils/api.error";

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      AppError.badRequest("User already exists");
    }

    const user = new User(username, email, password);

    if (!user.isValidEmail()) {
      AppError.badRequest("Invalid email format");
    }

    return await this.userRepo.create(user);
  }
}
