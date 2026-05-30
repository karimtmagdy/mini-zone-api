import { PaginatedResult } from "@/types/global.dto";
import { User } from "@/domain/entities/User";
import { UserRepoType } from "@/domain/types/person.types";

export class GetAllUsers {
  constructor(private userRepo: UserRepoType) {}

  async execute(query: any): Promise<PaginatedResult<User>> {
    return await this.userRepo.getAll(query);
  }
}
