import { EmployeeMapper } from "@/app/mapping/employee.mapper";
import { EmployeeDoc } from "@/domain/dto/employee.dto";
import { EmployeeEntity } from "@/domain/entities/employee.entity";
import { IEmployeeImpl } from "@/domain/interfaces/employee.repo.impl";
import { employeeDB } from "@/infra/db/employee.db";
import {
  TCreateEmployeeEX,
  TUpdateEmployeeEX,
} from "@/presentation/validator/employee.zod";
import { PaginatedResult, QueryResult } from "@/types";
import { Model, SortOrder } from "mongoose";

export class EmployeeImpl implements IEmployeeImpl {
  constructor(private readonly db: Model<EmployeeDoc>) {}

  async create(
    item: TCreateEmployeeEX & { code: string },
  ): Promise<EmployeeEntity> {
    const doc = await this.db.create({
      ...item,
      hiredAt: item.hiredAt ?? new Date(),
      status: item.status ?? "pending",
      salary: item.salary ?? 0,
    });
    return EmployeeMapper.toDomain(doc.toObject());
  }

  async findById(id: string): Promise<EmployeeEntity | null> {
    const doc = await this.db.findById(id).lean<EmployeeDoc>();
    if (!doc) return null;
    return EmployeeMapper.toDomain(doc);
  }

  async findByUserId(userId: string): Promise<EmployeeEntity | null> {
    const doc = await this.db.findOne({ userId }).lean<EmployeeDoc>();
    if (!doc) return null;
    return EmployeeMapper.toDomain(doc);
  }

  async findByCode(code: string): Promise<EmployeeEntity | null> {
    const doc = await this.db.findOne({ code }).lean<EmployeeDoc>();
    if (!doc) return null;
    return EmployeeMapper.toDomain(doc);
  }

  async exists(id: string): Promise<boolean> {
    const found = await this.db.exists({ _id: id });
    return found !== null;
  }

  async hasAdmin(): Promise<boolean> {
    const found = await this.db.exists({
      jobRole: "admin",
      isArchived: false,
      status: { $nin: ["terminated", "archive"] },
    });
    return found !== null;
  }

  async update(
    id: string,
    item: TUpdateEmployeeEX,
  ): Promise<EmployeeEntity | null> {
    const doc = await this.db
      .findByIdAndUpdate(id, item, { new: true })
      .lean<EmployeeDoc>();
    if (!doc) return null;
    return EmployeeMapper.toDomain(doc);
  }

  async archive(id: string): Promise<EmployeeEntity | null> {
    const doc = await this.db.findById(id);
    if (!doc) return null;
    const entity = EmployeeMapper.toDomain(doc.toObject());
    entity.archive();
    const payload = {
      ...EmployeeMapper.toPersistence(entity),
      status: "archive" as const,
    };
    const updated = await this.db
      .findByIdAndUpdate(id, payload, { new: true })
      .lean<EmployeeDoc>();
    if (!updated) return null;
    return EmployeeMapper.toDomain(updated);
  }

  async restore(id: string): Promise<EmployeeEntity | null> {
    const doc = await this.db.findById(id);
    if (!doc) return null;
    const entity = EmployeeMapper.toDomain(doc.toObject());
    entity.unarchive();
    const payload = {
      ...EmployeeMapper.toPersistence(entity),
      status: "inactive" as const,
    };
    const updated = await this.db
      .findByIdAndUpdate(id, payload, { new: true })
      .lean<EmployeeDoc>();
    if (!updated) return null;
    return EmployeeMapper.toDomain(updated);
  }

  async delete(id: string): Promise<EmployeeEntity | null> {
    const doc = await this.db.findByIdAndDelete(id).lean<EmployeeDoc>();
    if (!doc) return null;
    return EmployeeMapper.toDomain(doc);
  }

  async list(
    query: Partial<QueryResult>,
  ): Promise<PaginatedResult<EmployeeEntity>> {
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.max(1, Number(query.limit ?? 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { code: { $regex: query.search, $options: "i" } },
        { department: { $regex: query.search, $options: "i" } },
        { jobRole: { $regex: query.search, $options: "i" } },
        { job: { $regex: query.search, $options: "i" } },
      ];
    }

    const sort: Record<string, SortOrder> = {};
    if (query.sort) {
      const sortFields = query.sort.split(",");
      for (const field of sortFields) {
        const [k, ...rest] = field.split(":");
        const order = rest[0] === "desc" ? -1 : 1;
        if (k) sort[k] = order;
      }
    }
    if (Object.keys(sort).length === 0) {
      sort.createdAt = -1;
    }

    const projection = query.fields
      ? query.fields.split(",").filter(Boolean).join(" ")
      : undefined;

    const [total, docs] = await Promise.all([
      this.db.countDocuments(filter),
      this.db
        .find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      data: docs.map((d) => EmployeeMapper.toDomain(d as EmployeeDoc)),
      meta: {
        total,
        limit,
        pages: Math.ceil(total / limit),
        page,
      },
    };
  }
}

export const employeeRepo = new EmployeeImpl(employeeDB);
