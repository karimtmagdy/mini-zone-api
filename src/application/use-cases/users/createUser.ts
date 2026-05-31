import { User } from "@/domain/entities/User";
 import { AppError } from "@/shared/utils/api.error";
 import { NotifyService } from "@/application/services/notify.service";
// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser,EmployeeRepoType, UserRepoType,  } from "@/domain/types/person.types";
import { CreateUserDTO } from "@/shared/schema/person.zod";

export class CreateUser {
  constructor(
    private userRepo: UserRepoType,
    private employeeRepo: EmployeeRepoType,
    private notifyService: NotifyService,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(data: CreateUserDTO,  ): Promise<User> {
  // async execute(data: CreateUserDTO, performer?: IUser): Promise<User> {
    if (!data.email) throw AppError.badRequest("Email is required");
    const email = data.email.toLowerCase();

    // Check in both repositories
    const existingInUser = await this.userRepo.findByEmail(email);
    const existingInEmp = await this.employeeRepo.findByEmail(email);

    if (existingInUser || existingInEmp) {
      throw AppError.conflict(
        "A person with this email already exists in the system (as user or employee)",
      );
    }

    const existingUsername = await this.userRepo.findByUsername(data.username);
    if (existingUsername) {
      throw AppError.conflict("User with this username already exists");
    }

    const user = new User(data);
    const createdUser = await this.userRepo.create(user);
    // const createdUser = await this.userRepo.create(user, performer?.id);
    delete createdUser.password;

    // const loggingUser = performer || createdUser;
    // await this.recordActivity.execute({
    //  user: {
    //    username: loggingUser.username,
    //    email: loggingUser.email,
    //    role: loggingUser.role!,
    //  },
    //  action: performer ? "Admin created user" : "User registered",
    //  target: `User: ${createdUser.username}`,
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
