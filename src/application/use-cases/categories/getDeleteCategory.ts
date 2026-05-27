import { CategoryRepoType } from "@/domain/types/category.types";

export class GetDeletedCategories {
  constructor(private categoryRepo: CategoryRepoType) {}

  async execute() {
    return await this.categoryRepo.findDeleted();
  }
}
