import { CategoryRepoType } from "@/domain/interface/category.interface";

export class GetDeletedCategories {
  constructor(private categoryRepo: CategoryRepoType) {}

  async execute() {
    return await this.categoryRepo.findDeleted();
  }
}
