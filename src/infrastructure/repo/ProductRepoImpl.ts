import {
  ProductRepoType,
  IProduct,
   
} from "@/domain/types/product.types";
import { Product } from "@/domain/entities/Product";
import { productModel } from "@/infrastructure/database/product.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import {   PaginatedResult } from "@/types/global.dto";

export class ProductRepoImpl implements ProductRepoType {
  private mapEntityRef(ref: unknown): { id: string; name: string } | null {
    if (!ref) return null;

    if (typeof ref === "string") {
      return { id: ref, name: ref };
    }

    const doc = ref as Record<string, unknown>;
    const id = String(doc.id ?? doc._id ?? "");
    const name =
      typeof doc.name === "string" && doc.name.trim()
        ? doc.name.trim()
        : id;

    if (!id && !name) return null;
    return { id, name };
  }

  private mapEntityRefs(refs: unknown[] | unknown | undefined) {
    if (!refs) return [];
    const list = Array.isArray(refs) ? refs : [refs];
    return list
      .map((ref) => this.mapEntityRef(ref))
      .filter((ref): ref is { id: string; name: string } => ref !== null);
  }

  private populateQuery(query: any) {
    return query
      .populate({ path: "brand", select: "name" })
      .populate({ path: "category", select: "name" })
      .populate({ path: "subcategory", select: "name" });
  }

  private toEntity(doc: IProduct): Product {
    return new Product({
      name: doc.name,
      status: doc.status,
      images: doc.images,
      id: (doc.id || (doc as any)._id)?.toString(),
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      stock: doc.stock,
      sku: doc.sku,
      discount: doc.discount,
      sold: doc.sold,
      colors: doc.colors,
      category: this.mapEntityRef(doc.category) ?? doc.category,
      subcategory: this.mapEntityRefs(doc.subcategory),
      brand: this.mapEntityRef(doc.brand) ?? doc.brand,
      ratings: doc.ratings,
      reviews: doc.reviews,
      tags: doc.tags,
      finalPrice: doc.finalPrice,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(product: Product, performerId?: string): Promise<Product> {
    const data = { ...product };
    if (performerId) (data as any).createdBy = performerId;
    // implement image upload 
    // if (product.images && product.images.length > 0) {
    //   const uploadedImages = await this.uploadImages(product.images);
    //   data.images = uploadedImages;
    // }
    const doc = await productModel.create(data as any);
    const populated = await this.populateQuery(productModel.findById(doc._id)).lean();
    return this.toEntity((populated ?? doc) as IProduct);
  }

  async findByName(name: string): Promise<Product | null> {
    const doc = await productModel.findOne({ name }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await this.populateQuery(productModel.findById(id)).lean();
    return doc ? this.toEntity(doc as IProduct) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<Product>> {
    const features = new APIFeatures(productModel, query);
    const data = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name", "slug", "description"])
      .populate({ path: "brand", select: "name" })
      .populate({
        path: "category",
        select: "name",
      })
      .populate({ path: "subcategory", select: "name" })
      .execute();

    return {
      ...data,
      data: data.data.map((doc: any) => this.toEntity(doc)),
    };
  }

  async update(
    id: string,
    product: Partial<Product>,
    performerId?: string,
  ): Promise<Product | null> {
    const data = { ...product };
    if (performerId) (data as any).updatedBy = performerId;
    const doc = await this.populateQuery(
      productModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }),
    );
    return doc ? this.toEntity(doc as IProduct) : null;
  }

  async softDelete(id: string, performerId?: string): Promise<Product | null> {
    const updateData: any = {
      deletedAt: new Date(),
      status: 'archived',
    };
    if (performerId) updateData.deletedBy = performerId;

    const doc = await productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string, performerId?: string): Promise<Product | null> {
    const updateData: any = {
      deletedAt: null,
      status: 'active',
    };
    if (performerId) updateData.updatedBy = performerId;

    const doc = await productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Product[]> {
    const docs = await productModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await productModel.countDocuments(filter);
    return count > 0;
  }

  async findTopTen(): Promise<Product[]> {
    const docs = await productModel
      .find()
      .sort({ sold: -1 })
      .limit(10)
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findRelated(id: string): Promise<Product[]> {
    const product = await productModel.findById(id).lean();
    if (!product) return [];
    const docs = await productModel
      .find({
        category: product.category,
        _id: { $ne: id },
      })
      .limit(10)
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findTopRated(): Promise<Product[]> {
    const docs = await productModel
      .find()
      .sort({ "ratings.average": -1 })
      .limit(10)
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findLatest(): Promise<Product[]> {
    const docs = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findLowStock(): Promise<Product[]> {
    const docs = await productModel
      .find({ stock: { $lte: 10, $gt: 0 } })
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findHighStock(): Promise<Product[]> {
    const docs = await productModel
      .find({ stock: { $gte: 100 } })
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findOutOfStock(): Promise<Product[]> {
    const docs = await productModel.find({ stock: 0 }).lean().exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async updateStock(
    id: string,
    stock: number,
    performerId?: string,
  ): Promise<Product | null> {
    const updateData: any = { stock };
    if (performerId) updateData.updatedBy = performerId;
    const doc = await productModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const docs = await productModel
      .find({ category: categoryId })
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findByBrand(brandId: string): Promise<Product[]> {
    const docs = await productModel.find({ brand: brandId }).lean().exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findBySubcategory(subcategoryId: string): Promise<Product[]> {
    const docs = await productModel
      .find({ subcategory: subcategoryId })
      .lean()
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }
}
