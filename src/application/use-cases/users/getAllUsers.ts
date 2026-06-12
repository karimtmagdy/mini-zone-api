import { PaginatedResult } from "@/types/global.dto";
import { User } from "@/domain/entities/User";
import { UserRepoType } from "@/domain/types/person.types";
import { QueryStringDto } from "@/shared/schema/query.schema";

export class GetAllUsers {
  constructor(private userRepo: UserRepoType) {}

  async execute(query: QueryStringDto): Promise<PaginatedResult<User>> {
    return await this.userRepo.getAll(query);
  }
}
