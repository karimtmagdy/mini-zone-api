import { TPermission, TUserRole } from "@/domain/types/user.types";

export interface AccessTokenPayload {
  sub: string;
  role: TUserRole;
  permissions: TPermission[];
  type: "access";
}
