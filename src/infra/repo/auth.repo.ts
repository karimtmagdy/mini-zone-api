import { CustomerEntity } from "@/domain/entities/customer.entity";
import {
  IAuthImpl,
  ICreateCustomerData,
  IUpdateUserAccess,
} from "@/domain/interfaces/auth.repo.impl";
import { CustomerDoc } from "@/domain/dto/user.dto";
import { Model } from "mongoose";
import { customerDB, verifyCustomerPassword } from "../db/customer.db";
import { CustomerMapper } from "@/app/mapping/customer.mapper";

export class AuthRepo implements IAuthImpl {
  constructor(private readonly db: Model<CustomerDoc>) {}

  async create(data: ICreateCustomerData): Promise<CustomerEntity> {
    // The schema pre-save hook in customer.db.ts hashes the password.
    const doc = await this.db.create(data);
    return CustomerMapper.toDomain(doc.toObject());
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const doc = await this.db.findOne({ email }).lean<CustomerDoc>();
    if (!doc) return null;
    return CustomerMapper.toDomain(doc);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const doc = await this.db.findById(id).lean<CustomerDoc>();
    if (!doc) return null;
    return CustomerMapper.toDomain(doc);
  }

  async verifyPassword(email: string, candidate: string): Promise<boolean> {
    return verifyCustomerPassword(email, candidate);
  }

  async updateAccess(
    id: string,
    data: IUpdateUserAccess,
  ): Promise<CustomerEntity | null> {
    const doc = await this.db
      .findByIdAndUpdate(
        id,
        { role: data.role, permissions: data.permissions },
        { new: true },
      )
      .lean<CustomerDoc>();
    if (!doc) return null;
    return CustomerMapper.toDomain(doc);
  }
}

export const authRepo = new AuthRepo(customerDB);
