import { User } from '@/domain/entities/User';
import { UserRepoType } from '@/domain/types/person.types';
import { AppError } from '@/shared/utils/api.error';

export class GetUserById {
  constructor(private userRepo: UserRepoType) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  }
}
