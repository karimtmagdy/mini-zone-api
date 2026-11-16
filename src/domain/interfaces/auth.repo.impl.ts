import { CustomerEntity } from "@/domain/entities/customer.entity";
import { TPermission, TUserRole } from "@/domain/types/user.types";

export interface ICreateCustomerData {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
  permissions: TPermission[];
}

export interface IAuthImpl {
  create(data: ICreateCustomerData): Promise<CustomerEntity>;
  findByEmail(email: string): Promise<CustomerEntity | null>;
  findById(id: string): Promise<CustomerEntity | null>;
  verifyPassword(email: string, candidate: string): Promise<boolean>;
}
