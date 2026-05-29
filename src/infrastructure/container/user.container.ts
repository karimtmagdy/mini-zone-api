import { UserRepoImpl } from "@/infrastructure/repo/UserRepoImpl";
import { EmployeeRepoImpl } from "@/infrastructure/repo/EmployeeRepoImpl";
import { CreateUser } from "@/application/use-cases/users/createUser";
import { GetAllUsers } from "@/application/use-cases/users/getAllUsers";
import { GetUserById } from "@/application/use-cases/users/getUserById";
import { UpdateUser } from "@/application/use-cases/users/updateUser";
import { SoftDeleteUser } from "@/application/use-cases/users/softDeleteUser";
import { RestoreUser } from "@/application/use-cases/users/restoreUser";
import { ChangeUserRole } from "@/application/use-cases/users/changeUserRole";
import { UpdateUserStatus } from "@/application/use-cases/users/updateUserStatus";
import { BulkDeactivateUsers } from "@/application/use-cases/users/bulkDeactivateUsers";
import { BulkArchiveUsers } from "@/application/use-cases/users/bulkArchiveUsers";
import { BulkDeleteUsers } from "@/application/use-cases/users/bulkDeleteUsers";
import { UserController } from "@/presentation/controllers/user.controller";

import { notifyService } from "@/application/services/notify.service";
// import { recordActivityUseCase } from "./activity-log.container";

const userRepository = new UserRepoImpl();
const employeeRepository = new EmployeeRepoImpl();

export const createUserUseCase = new CreateUser(
  userRepository,
  employeeRepository,
  notifyService,
);
export const getAllUsersUseCase = new GetAllUsers(userRepository);
export const getUserByIdUseCase = new GetUserById(userRepository);
export const updateUserUseCase = new UpdateUser(
  userRepository,
  employeeRepository,
);
export const softDeleteUserUseCase = new SoftDeleteUser(userRepository);
export const restoreUserUseCase = new RestoreUser(userRepository);
export const changeUserRoleUseCase = new ChangeUserRole(userRepository);
export const updateUserStatusUseCase = new UpdateUserStatus(userRepository);
export const bulkDeactivateUsersUseCase = new BulkDeactivateUsers(
  userRepository,
);
export const bulkArchiveUsersUseCase = new BulkArchiveUsers(userRepository);
export const bulkDeleteUsersUseCase = new BulkDeleteUsers(userRepository);

export const userCtrl = new UserController(
  createUserUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  softDeleteUserUseCase,
  restoreUserUseCase,
  changeUserRoleUseCase,
  updateUserStatusUseCase,
  bulkDeactivateUsersUseCase,
  bulkArchiveUsersUseCase,
  bulkDeleteUsersUseCase,
  userRepository,
);
