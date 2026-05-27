import { Review } from "@/models/review.model";
import { IReview } from "@/types/review.dto";

export class ReviewRepository {
  async create(data: Partial<IReview>) {
    return await Review.create(data);
  }

  async findOne(filter: Record<string, any>) {
    return await Review.findOne(filter).populate("user", "username photo");
  }

  async findAll(filter: Record<string, any> = {}) {
    return await Review.find(filter)
      .populate("user", "username photo")
      .sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await Review.findById(id).populate("user", "username photo");
  }

  async update(id: string, data: Record<string, any>) {
    return await Review.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    }).populate("user", "username photo");
  }

  async delete(id: string) {
    // We use findOneAndDelete to trigger the mongoose hook
    return await Review.findOneAndDelete({ _id: id });
  }

  async findByProduct(productId: string) {
    return await Review.find({ product: productId }).populate(
      "user",
      "username photo"
    );
  }
}

export const reviewRepo = new ReviewRepository();
