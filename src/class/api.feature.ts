import { Model, Query, QueryFilter } from "mongoose";
import { APIFeaturesResultDto, QueryStringDto } from "../types/query.dto.js";

class APIFeatures<T> {
  private model: Model<T>;
  private query: Query<T[], T>;
  private QS: QueryStringDto;
  private FQ: QueryFilter<T>;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private readonly DEFAULT_LIMIT = 10;
  private readonly MAX_LIMIT = 50;

  constructor(model: Model<T>, queryString: QueryStringDto) {
    this.model = model;
    this.QS = queryString;
    this.FQ = {};
    // Initialize query with empty filter (will be populated by filter method)
    this.query = this.model.find();
  }
  filter(): this {
    // Create shallow copy of query string
    const queryObj = { ...this.QS };
    const excludedFields: (keyof QueryStringDto)[] = [
      "page",
      "limit",
      "sort",
      "fields",
      "search",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    const regex: RegExp = /\b(gte|gt|lte|lt|in|nin|ne|eq)\b/g;
    // const regex: RegExp = /\b(gte|gt|lte|lt|in|nin|ne|eq)\b/gi;
    queryStr = queryStr.replace(regex, (match) => `$${match}`);
    this.FQ = JSON.parse(queryStr);
    this.query = this.model.find(this.FQ);
    return this;
  }
  sort(): this {
    if (this.QS.sort) {
      // Convert comma-separated values to space-separated for Mongoose
      const sortBy = (this.QS.sort as string).split(",").join(" ") + " id";
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt id");
    }
    return this;
  }
  limitFields(): this {
    if (this.QS.fields) {
      const fields = (this.QS.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate(): this {
    const pageNum = Number(this.QS.page);
    this.page = pageNum > 0 ? pageNum : 1;
    const limitNum = Number(this.QS.limit);
    this.limit =
      limitNum > 0 ? Math.min(limitNum, this.MAX_LIMIT) : this.DEFAULT_LIMIT;
    this.skip = (this.page - 1) * this.limit;
    this.query = this.query.skip(this.skip).limit(this.limit);
    return this;
  }
  search(searchFields: string[]): this {
    if (this.QS.search && searchFields.length > 0) {
      const searchTerm = this.QS.search as string;
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));
      const searchQuery: QueryFilter<T> = {
        $or: searchConditions,
      } as QueryFilter<T>;
      this.query = this.model.find({
        $and: [this.FQ, searchQuery],
      } as QueryFilter<T>);
    }
    return this;
  }
  populate(fields: any): this {
    this.query = this.query.populate(fields);
    return this;
  }
  async execute(): Promise<APIFeaturesResultDto<T>> {
    const total = await this.model.countDocuments(
      this.query.getFilter() as QueryFilter<T>,
    );
    const data = await this.query;
    const pages = Math.ceil(total / this.limit);
    return {
      data,
      pagination: {
        page: this.page,
        pages,
        limit: this.limit,
        total,
        results: data.length,
      },
    };
  }
}

export { APIFeatures };
