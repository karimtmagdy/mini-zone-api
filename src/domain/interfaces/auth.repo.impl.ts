import { UserEntity } from "@/domain/entities/user.entity";
import { TPermission, TUserRole } from "@/domain/types/user.types";

export interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
  permissions: TPermission[];
}

export interface IAuthImpl {
  create(data: ICreateUserData): Promise<UserEntity>;
  findByEmail(
    email: string,
    selectPassword?: boolean,
  ): Promise<UserEntity | null>;
}
