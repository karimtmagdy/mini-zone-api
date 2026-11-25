import { Request, Response } from "express";
import { CTErr } from "@/common/lib/catch-error";
import { EmployeeMapper } from "@/app/mapping/employee.mapper";
import { employeeRepo } from "@/infra/repo/employee.repo";
import { authRepo } from "@/infra/repo/auth.repo";
import {
  ArchiveEmployeeUC,
  BootstrapAdminUC,
  CreateEmployeeUC,
  DeleteEmployeeUC,
  GetEmployeeByIdUC,
  HireEmployeeUC,
  ListEmployeesUC,
  RestoreEmployeeUC,
  UpdateEmployeeStatusUC,
  UpdateEmployeeUC,
} from "@/app/use-cases/employee/employee.uc";
import {
  TBootstrapAdminEX,
  TCreateEmployeeEX,
  THireEmployeeEX,
  TUpdateEmployeeEX,
  TUpdateEmployeeStatusEX,
  bootstrapAdmin,
  createEmployee,
  hireEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "@/presentation/validator/employee.zod";
import { QueryResult } from "@/types";

export class EmployeeController {
  constructor(
    private createUC: CreateEmployeeUC,
    private hireUC: HireEmployeeUC,
    private bootstrapUC: BootstrapAdminUC,
    private getByIdUC: GetEmployeeByIdUC,
    private listUC: ListEmployeesUC,
    private updateUC: UpdateEmployeeUC,
    private deleteUC: DeleteEmployeeUC,
    private archiveUC: ArchiveEmployeeUC,
    private restoreUC: RestoreEmployeeUC,
    private updateStatusUC: UpdateEmployeeStatusUC,
  ) {}

  all = CTErr(
    async (
      req: Request<unknown, unknown, unknown, Partial<QueryResult>>,
      res: Response,
    ) => {
      const result = await this.listUC.execute(req.query);
      res.status(200).json({
        status: "success",
        meta: result.meta,
        data: result.data.map((e) => EmployeeMapper.toRoute(e)),
      });
    },
  );

  create = CTErr(
    async (
      req: Request<unknown, unknown, TCreateEmployeeEX>,
      res: Response,
    ) => {
      const validated = createEmployee.parse(req.body);
      const result = await this.createUC.execute(validated);
      res.status(201).json({
        status: "success",
        message: "employee has been created",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  hire = CTErr(
    async (
      req: Request<unknown, unknown, THireEmployeeEX>,
      res: Response,
    ) => {
      const validated = hireEmployee.parse(req.body);
      const result = await this.hireUC.execute(validated);
      res.status(201).json({
        status: "success",
        message: "employee account has been created",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  bootstrap = CTErr(
    async (
      req: Request<unknown, unknown, TBootstrapAdminEX>,
      res: Response,
    ) => {
      const validated = bootstrapAdmin.parse(req.body);
      const result = await this.bootstrapUC.execute({
        userId: req.user.sub,
        data: validated,
      });
      res.status(201).json({
        status: "success",
        message:
          "admin employee bootstrapped — re-login to refresh token permissions",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  one = CTErr(async (req: Request<{ employeeId: string }>, res: Response) => {
    const { employeeId } = req.params;
    const result = await this.getByIdUC.execute(employeeId);
    res.status(200).json({
      status: "success",
      data: EmployeeMapper.toRoute(result),
    });
  });

  update = CTErr(
    async (
      req: Request<{ employeeId: string }, unknown, TUpdateEmployeeEX>,
      res: Response,
    ) => {
      const { employeeId } = req.params;
      const validated = updateEmployee.parse(req.body);
      const result = await this.updateUC.execute({
        id: employeeId,
        data: validated,
      });
      res.status(200).json({
        status: "success",
        message: "employee has been updated",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  archive = CTErr(
    async (req: Request<{ employeeId: string }>, res: Response) => {
      const { employeeId } = req.params;
      const result = await this.archiveUC.execute(employeeId);
      res.status(200).json({
        status: "success",
        message: "employee has been moved to archived",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  restore = CTErr(
    async (req: Request<{ employeeId: string }>, res: Response) => {
      const { employeeId } = req.params;
      const result = await this.restoreUC.execute(employeeId);
      res.status(200).json({
        status: "success",
        message: "employee has been restored (unarchived)",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  updateStatus = CTErr(
    async (
      req: Request<{ employeeId: string }, unknown, TUpdateEmployeeStatusEX>,
      res: Response,
    ) => {
      const { employeeId } = req.params;
      const validated = updateEmployeeStatus.parse(req.body);
      const result = await this.updateStatusUC.execute({
        id: employeeId,
        data: validated,
      });
      res.status(200).json({
        status: "success",
        message: `employee status has been updated to ${validated.status}`,
        data: EmployeeMapper.toRoute(result),
      });
    },
  );

  remove = CTErr(
    async (req: Request<{ employeeId: string }>, res: Response) => {
      const { employeeId } = req.params;
      const result = await this.deleteUC.execute(employeeId);
      res.status(200).json({
        status: "success",
        message: "employee has been deleted permanently",
        data: EmployeeMapper.toRoute(result),
      });
    },
  );
}

const createEmployeeUC = new CreateEmployeeUC(employeeRepo, authRepo);

export const ctrlEmployee = new EmployeeController(
  createEmployeeUC,
  new HireEmployeeUC(authRepo, createEmployeeUC),
  new BootstrapAdminUC(employeeRepo, authRepo, createEmployeeUC),
  new GetEmployeeByIdUC(employeeRepo),
  new ListEmployeesUC(employeeRepo),
  new UpdateEmployeeUC(employeeRepo, authRepo),
  new DeleteEmployeeUC(employeeRepo, authRepo),
  new ArchiveEmployeeUC(employeeRepo),
  new RestoreEmployeeUC(employeeRepo),
  new UpdateEmployeeStatusUC(employeeRepo, authRepo),
);
