import { Request, Response } from "express";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { User } from "@/domain/entities/User";
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
import { UserRepoImpl } from "@/infrastructure/repo/UserRepoImpl";
import { queryZod } from "@/shared/schema/query.schema";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";

export class UserController {
  constructor(
    private createUserUC: CreateUser,
    private getAllUsersUC: GetAllUsers,
    private getUserByIdUC: GetUserById,
    private updateUserUC: UpdateUser,
    private softDeleteUserUC: SoftDeleteUser,
    private restoreUserUC: RestoreUser,
    private changeUserRoleUC: ChangeUserRole,
    private updateUserStatusUC: UpdateUserStatus,
    private bulkDeactivateUsersUC: BulkDeactivateUsers,
    private bulkArchiveUsersUC: BulkArchiveUsers,
    private bulkDeleteUsersUC: BulkDeleteUsers,
    private userRepo: UserRepoImpl, // Directly passing repo for simple actions to save boilerplate
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const result = await this.createUserUC.execute(req.body, );
    // const result = await this.createUserUC.execute(req.body, req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been created",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const query = queryZod.parse(req.query);
    const result = await this.getAllUsersUC.execute(query);
    const response: ResponseWithMetaDto<User[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getUserByIdUC.execute(id);
    const response: ResponseDto<User> = { status: "success", data: result };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.updateUserUC.execute(id, req.body, req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been updated",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteUserUC.execute(id, req.user);
    const response: ResponseDto<User | null> = {
      status: "success",
      message: "user moved to archive",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreUserUC.execute(id, req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been restored",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (req: Request, res: Response) => {
    const query = queryZod.parse(req.query);
    const result = await this.userRepo.findDeleted(query);
    const response: ResponseWithMetaDto<User[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  deactivate = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.updateUserStatusUC.execute(
      id,
      "deactivated",
      req.user,
    );
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been deactivated",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  unlock = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.updateUserStatusUC.execute(
      id,
      "active",
      req.user,
      {
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
    );
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been unlocked",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  changeRole = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { role } = req.body;
    const result = await this.changeUserRoleUC.execute(id, role, req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: `user role has been updated to ${role}`,
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  ban = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.updateUserStatusUC.execute(id, "banned", req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been banned",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  reactivate = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreUserUC.execute(id, req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: "user has been reactivated",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  updateStatus = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const result = await this.updateUserStatusUC.execute(id, status, req.user);
    const response: ResponseDto<User> = {
      status: "success",
      message: `user status has been updated to ${status}`,
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  bulkDeactivate = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };
    const count = await this.bulkDeactivateUsersUC.execute(ids, req.user);
    const response: ResponseDto<any> = {
      status: "success",
      message: `${count} users have been deactivated`,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  bulkArchive = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };
    const count = await this.bulkArchiveUsersUC.execute(ids, req.user);
    const response: ResponseDto<any> = {
      status: "success",
      message: `${count} users have been archived`,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  bulkDelete = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };
    const count = await this.bulkDeleteUsersUC.execute(ids, req.user);
    const response: ResponseDto<any> = {
      status: "success",
      message: `${count} users have been deleted`,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
