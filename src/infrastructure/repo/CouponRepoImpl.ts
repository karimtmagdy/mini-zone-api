import { CouponRepoType, ICoupon } from "@/domain/types/coupon.types";
import { Coupon } from "@/domain/entities/Coupon";
import { couponModel } from "../database/coupon.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { PaginatedResult } from "@/types/global.dto";

export class CouponRepoImpl implements CouponRepoType {
  private toEntity(doc: ICoupon): Coupon {
    return new Coupon({
      id: doc.id?.toString(),
      code: doc.code,
      discount: doc.discount,
      usedCount: doc.usedCount,
      expiresAt: doc.expiresAt,
      isActive: doc.isActive,
      minOrderAmount: doc.minOrderAmount,
      usageLimit: doc.usageLimit,
      startsAt: doc.startsAt,
      campaignId: doc.campaignId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
    });
  }

  async create(coupon: Partial<Coupon>, performerId?: string): Promise<Coupon> {
    const data = { ...coupon };
    if (performerId) (data as any).createdBy = performerId;
    const doc = await couponModel.create(data as any);
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<Coupon | null> {
    const doc = await couponModel.findById(id).lean();
    return doc ? this.toEntity(doc as any) : null;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const doc = await couponModel
      .findOne({
        code: code.toUpperCase(),
        deletedAt: null,
      })
      .lean();
    return doc ? this.toEntity(doc as any) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<Coupon>> {
    const features = new APIFeatures(couponModel, query);
    const data = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["code"])
      .execute();

    return {
      ...data,
      data: data.data.map((doc: any) => this.toEntity(doc)),
    };
  }

  async update(
    id: string,
    coupon: Partial<Coupon>,
    performerId?: string,
  ): Promise<Coupon | null> {
    const data = { ...coupon };
    if (performerId) (data as any).updatedBy = performerId;
    const doc = await couponModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await couponModel.findByIdAndDelete(id).exec();
  }

  async deleteBulk(ids: string[]): Promise<void> {
    await couponModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async softDelete(id: string, performerId?: string): Promise<Coupon | null> {
    const updateData: any = { deletedAt: new Date() };
    if (performerId) updateData.deletedBy = performerId;

    const doc = await couponModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string, performerId?: string): Promise<Coupon | null> {
    const updateData: any = { deletedAt: null };
    if (performerId) updateData.updatedBy = performerId;

    const doc = await couponModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Coupon[]> {
    const docs = await couponModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async incrementUsedCount(id: string): Promise<Coupon | null> {
    const doc = await couponModel.findByIdAndUpdate(
      id,
      { $inc: { usedCount: 1 } },
      { new: true },
    );
    return doc ? this.toEntity(doc) : null;
  }

  async insertMany(coupons: Partial<Coupon>[]): Promise<Coupon[]> {
    const docs = await couponModel.insertMany(coupons, { ordered: false });
    return docs.map((doc) => this.toEntity(doc as any));
  }
}
