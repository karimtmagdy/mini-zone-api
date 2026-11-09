import { UserEntity } from "@/domain/entities/user.entity";
import { IAuthImpl, ICreateUserData } from "@/domain/interfaces/auth.repo.impl";
import { UserDoc } from "@/domain/dto/user.dto";
import { Model } from "mongoose";
import { userDB } from "../db/user.db";
import { UserMapper } from "@/app/mapping/user.mapper";
import bcrypt from "bcryptjs";

export class AuthRepo implements IAuthImpl {
  constructor(private readonly db: Model<UserDoc>) {}

  async create(data: ICreateUserData): Promise<UserEntity> {
    const hashed = await bcrypt.hash(data.password, 12);
    const doc = await this.db.create({ ...data, password: hashed });
    return UserMapper.toDomain(doc.toObject());
  }

  async findByEmail(
    email: string,
    selectPassword = false,
  ): Promise<UserEntity | null> {
    const query = this.db.findOne({ email });
    if (selectPassword) {
      query.select("+password");
    }
    const doc = await query.lean<UserDoc>();
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }
}

export const authRepo = new AuthRepo(userDB);
