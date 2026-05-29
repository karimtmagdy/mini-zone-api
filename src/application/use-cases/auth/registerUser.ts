import { User } from "@/domain/entities/User";
import { UserRepoType } from "@/domain/types/user.types";
import { AppError } from "@/shared/utils/api.error";
import { UserRoleEnum } from "@/domain/types/user.types";
import { NotifyService } from "@/application/services/notify.service";
// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";

export class RegisterUser {
  constructor(
    private userRepo: UserRepoType,
    private notifyService: NotifyService,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw AppError.badRequest("User already exists");
    }

    const user = new User({ username, email, password });

    if (!user.isValidEmail()) {
      throw AppError.badRequest("Invalid email format");
    }

    const createdUser = await this.userRepo.create(user);
    delete createdUser.password;

    // Log Activity
    // await this.recordActivity.execute({
    //  user: {
    //    username: createdUser.username,
    //    email: createdUser.email,
    //    role: createdUser.role || UserRoleEnum.USER,
    //    image: createdUser.image
    //      ? {
    //          url: createdUser.image.url || "",
    //          publicId: createdUser.image.publicId || "",
    //        }
    //      : undefined,
    //  },
    //  action: "User registered",
    //  target: "System",
    //  details: { userId: createdUser.id },
    //  timestamp: new Date(),
    // });

    // Notify user
    await this.notifyService.sendWelcomeEmail(
      createdUser.email,
      createdUser.username,
    );

    return createdUser;
  }
}
