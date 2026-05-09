import { ProductRepoType } from "@/domain/interface/product.interface";
import { Product } from "@/domain/entities/Product";
import { productModel } from "@/infrastructure/database/product.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { ProductStatusEnum, IProduct } from "@/domain/types/product.types";
import { PaginatedResult } from "@/_R/types/global.dto";

export class ProductRepoImpl implements ProductRepoType {
  private toEntity(doc: IProduct): Product {
    return new Product({
      name: doc.name,
      status: doc.status,
      images: doc.images,
      id: doc.id?.toString(),
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      stock: doc.stock,
      sku: doc.sku,
      discount: doc.discount,
      sold: doc.sold,
      colors: doc.colors,
      category: doc.category,
      subcategory: doc.subcategory,
      brand: doc.brand,
      ratings: doc.ratings,
      reviews: doc.reviews,
      tags: doc.tags,
      finalPrice: doc.finalPrice,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(product: Product): Promise<Product> {
    const doc = await productModel.create(product);
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<Product | null> {
    const doc = await productModel.findOne({ name });
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await productModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<Product>> {
    const features = new APIFeatures(productModel, query);
    const data = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name", "slug", "description"])
      .populate("brand")
      .populate({
        path: "category",
        select: "name",
      })
      .populate("subcategory")
      .execute();

    return {
      ...data,
      data: data.data.map((doc: any) => this.toEntity(doc)),
    };
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const doc = await productModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string): Promise<Product | null> {
    const doc = await productModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: ProductStatusEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string): Promise<Product | null> {
    const doc = await productModel
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: ProductStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Product[]> {
    const docs = await productModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await productModel.countDocuments(filter);
    return count > 0;
  }

  async findTopTen(): Promise<Product[]> {
    const docs = await productModel.find().sort({ sold: -1 }).limit(10).exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findRelated(id: string): Promise<Product[]> {
    const product = await productModel.findById(id);
    if (!product) return [];
    const docs = await productModel
      .find({
        category: product.category,
        _id: { $ne: id },
      })
      .limit(10)
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findTopRated(): Promise<Product[]> {
    const docs = await productModel
      .find()
      .sort({ "ratings.average": -1 })
      .limit(10)
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findLatest(): Promise<Product[]> {
    const docs = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findLowStock(): Promise<Product[]> {
    const docs = await productModel
      .find({ stock: { $lte: 10, $gt: 0 } })
      .exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findHighStock(): Promise<Product[]> {
    const docs = await productModel.find({ stock: { $gte: 100 } }).exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findOutOfStock(): Promise<Product[]> {
    const docs = await productModel.find({ stock: 0 }).exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async updateStock(id: string, stock: number): Promise<Product | null> {
    const doc = await productModel
      .findByIdAndUpdate(id, { stock }, { new: true, runValidators: true })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const docs = await productModel.find({ category: categoryId }).exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findByBrand(brandId: string): Promise<Product[]> {
    const docs = await productModel.find({ brand: brandId }).exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async findBySubcategory(subcategoryId: string): Promise<Product[]> {
    const docs = await productModel.find({ subcategory: subcategoryId }).exec();
    return docs.map((doc: any) => this.toEntity(doc));
  }
}
