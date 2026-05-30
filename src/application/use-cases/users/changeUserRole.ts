import { User } from "@/domain/entities/User";
import { UserRepoType, RolePerson ,IUser} from "@/domain/types/person.types";
import { AppError } from "@/shared/utils/api.error";
// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
 
export class ChangeUserRole {
  constructor(
    private userRepo: UserRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, role: RolePerson, performer?: IUser): Promise<User> {
    const user = await this.userRepo.update(id, { role }, performer?.id);
    if (!user) throw AppError.notFound("User not found");

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: `Changed role to ${role}`,
    //    target: `User: ${user.username}`,
    //    details: { userId: id, newRole: role },
    //    timestamp: new Date(),
    //   });
    }

    return user;
  }
}
