import { Model } from "mongoose";
import { QueryStringDto } from "../unity/core/query.dto";
 
class APIFeatures<T> {
  private model: Model<T>;
  private QS: QueryStringDto;
  private FQ: any = {};
  private searchFilter: any = {};
  private page: number = 1;
  private limit: number = 10;
  private withDeleted: boolean = false;
  private populateFields: any = null;
  private selectedFields: string = "-__v";
  private sortQuery: string = "-createdAt id";
  private readonly DEFAULT_LIMIT = 10;
  private readonly MAX_LIMIT = 50;

  constructor(model: Model<T>, queryString: QueryStringDto) {
    this.model = model;
    this.QS = queryString;
  }

  filter(): this {
    const queryObj = { ...this.QS };
    const excludedFields: any[] = [
      "page",
      "limit",
      "sort",
      "fields",
      "search",
      "withDeleted",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in|nin|ne|eq)\b/g,
      (match) => `$${match}`,
    );
    this.FQ = JSON.parse(queryStr);

    if (this.QS.status === "archived") {
      this.FQ = {
        ...this.FQ,
        $or: [{ status: "archived" }, { deletedAt: { $ne: null } }],
      };
      delete this.FQ.status;
      this.withDeleted = true;
    } else if (this.QS.withDeleted === "true") {
      this.withDeleted = true;
    }

    return this;
  }

  sort(): this {
    if (this.QS.sort) {
      this.sortQuery = (this.QS.sort as string).split(",").join(" ") + " id";
    }
    return this;
  }

  limitFields(): this {
    if (this.QS.fields) {
      this.selectedFields = (this.QS.fields as string).split(",").join(" ");
    }
    return this;
  }

  paginate(): this {
    const pageNum = Number(this.QS.page);
    this.page = pageNum > 0 ? pageNum : 1;
    const limitNum = Number(this.QS.limit);
    this.limit =
      limitNum > 0 ? Math.min(limitNum, this.MAX_LIMIT) : this.DEFAULT_LIMIT;
    return this;
  }

  search(searchFields: string[]): this {
    if (this.QS.search && searchFields.length > 0) {
      const searchTerm = this.QS.search as string;
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));
      this.searchFilter = { $or: searchConditions };
    }
    return this;
  }

  populate(fields: any): this {
    this.populateFields = fields;
    return this;
  }

  async execute(): Promise<any> {
    // Combine everything into one final filter
    const finalFilter =
      Object.keys(this.searchFilter).length > 0
        ? { $and: [this.FQ, this.searchFilter] }
        : this.FQ;

    // 1. Get accurate TOTAL count
    const countQuery = this.model.countDocuments(finalFilter);
    if (this.withDeleted) countQuery.setOptions({ withDeleted: true });
    const total = await countQuery;

    // 2. Get accurate DATA
    const skip = (this.page - 1) * this.limit;
    let dataQuery = this.model
      .find(finalFilter)
      .sort(this.sortQuery)
      .select(this.selectedFields)
      .skip(skip)
      .limit(this.limit);

    if (this.withDeleted) dataQuery.setOptions({ withDeleted: true });
    if (this.populateFields) dataQuery = dataQuery.populate(this.populateFields);

    const data = await dataQuery;
    const pages = Math.ceil(total / this.limit);

    return {
      data,
      meta: {
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
