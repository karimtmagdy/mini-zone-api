import { IBaseImage, IBaseMetadata, PaginatedResult } from "@/types/global.dto";
import { User } from "../entities/User";
import { Employee } from "../entities/Employee";
import { QueryStringDto } from "@/shared/schema/query.schema";
 
export const PERSON_STATE = ["online", "offline"] as const;
export const PERSON_GENDERS = ["male", "female"] as const;

export const PERSON_TRANSITIONS = {
  pending: ["verified", "banned"],
  verified: ["active", "suspended"],
  active: [
    "inactive",
    "suspended",
    "on-leave",
    "deactivated",
    "terminated",
  ],
  inactive: ["active", "terminated"],
  suspended: ["active", "banned"],
  banned: ["archived"],
  "on-leave": ["active"],
  deactivated: ["active", "archived"],
  locked: ["active", "suspended"],
  terminated: ["archived"],
  archived: [],
} as const;
export type PersonStatus = keyof typeof PERSON_TRANSITIONS;

export const PERSON_STATUS =
  Object.keys(PERSON_TRANSITIONS) as PersonStatus[];
  type ActiveTransitions =
  typeof PERSON_TRANSITIONS["active"][number];
  // type ActiveTransitions =
  // | "inactive"
  // | "suspended"
  // | "on-leave"
  // | "deactivated"
  // | "terminated";
 

export type PersonState = (typeof PERSON_STATE)[number];
export type PersonGender = (typeof PERSON_GENDERS)[number];
 
export interface IPerson extends IBaseMetadata, IBaseImage {
  id: string;
  username: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  slug: string;
  role: RolePerson;
  remember: boolean;
  password: string;
  status: PersonStatus;
  state: PersonState;
  gender: PersonGender;
  adult: boolean;
  age: number;
  phone?: string;
  lockedUntil: Date;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  lastLoginAt: Date;
  passwordChangedAt: Date;
  activeAt: Date;
  logoutAt: Date;
  verifiedAt?: Date;
  
}

// export interface UserDto extends IPerson {
//   employeeId?: string;
// }
export const PERSON_ROLES = [
  "user",
  "super-admin",
  "admin",
  "manager",
  "viewer",
  "seller",
  "delivery-boy",
  "staff",
  "customer-support",
  "vendor",
  "hr",
] as const;

export type RolePerson = (typeof PERSON_ROLES)[number];

export interface IUser extends IPerson {
  // employeeId?: any;
}
export interface UserRepoType {
  create(user: User, performerId?: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(
    id: string,
    user: Partial<User>,
    performerId?: string,
  ): Promise<User | null>;
  getAll(query: QueryStringDto): Promise<PaginatedResult<User>>;
  findDeleted(query: QueryStringDto): Promise<PaginatedResult<User>>;
  softDelete(id: string, performerId?: string): Promise<User | null>;
  restore(id: string, performerId?: string): Promise<User | null>;
  deleteById(id: string): Promise<boolean>;
  bulkUpdate(
    ids: string[],
    data: Partial<User>,
    performerId?: string,
  ): Promise<number>;
  bulkDelete(ids: string[]): Promise<number>;
}

export const EMPLOYEE_DEPARTMENTS = [
  "HR",
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "Support",
  "Management",
  "Operations",
  "IT",
] as const;

export const EMPLOYEE_JOB_TITLES = [
  "Manager",
  "Developer",
  "Designer",
  "Analyst",
  "Specialist",
  "Coordinator",
  "Director",
  "Lead",
  "Associate",
  "Consultant",
] as const;
export type EmployeeDepartment = (typeof EMPLOYEE_DEPARTMENTS)[number];
export type EmployeeJobTitle = (typeof EMPLOYEE_JOB_TITLES)[number];

export interface IEmployee extends IPerson {
  code: string;
  department: EmployeeDepartment;
  jobTitle: EmployeeJobTitle;
  salary?: number;
  hiredAt: Date;
  managerId?: any;
}

export interface EmployeeRepoType {
  create(employee: Employee): Promise<Employee>;
  findByEmail(email: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
  findAll(query: QueryStringDto): Promise<PaginatedResult<Employee>>;
  update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
  softDelete(id: string): Promise<Employee | null>;
  restore(id: string): Promise<Employee | null>;
  findDeleted(): Promise<Employee[]>;
  exists(filter: Record<string, unknown>): Promise<boolean>;
  findLastEmployeeCode(): Promise<string | null>;
  findByDepartment(department: string): Promise<Employee[]>;
  findByManager(managerId: string): Promise<Employee[]>;
}


  const allowedRoles = ["admin", "manager", "moderator"] as const;
  type AccessRole = (typeof allowedRoles)[number];
  const isAuthorized = allowedRoles.includes!("user" as AccessRole);

  //   cart?: string;
//   order?: string;
//   permission: string[];
//   wishlist?: string;
//   likes?: string;
//   favorite?: string;
//   address?: string;
//   resetPasswordToken?: string;
//   resetPasswordExpireAt?: string;
//   forgotPassword?: string;
//   forgotPasswordExpiry?: string;
//   verificationToken?: string;
//   verificationTokenExpireAt?: string;
//   verifyOtp?: string;
//   verifyOtpExpireAt?: number;
//   resetOtp?: string;
//   resetOtpExpireAt?: number;
//   wishlist: any[];
//   likes: any[];
//   favorite: any[];
//   permissions: string[];
//   orders: any[];
//   tags: any[];