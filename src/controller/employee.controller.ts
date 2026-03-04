import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../service/employee.service.js";
import { catchError } from "../lib/catch.error.js";

export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  create = catchError(async (req: Request, res: Response) => {
    const employee = await this.service.create(req.body);
    res.status(201).json({ status: "success", data: employee.toJSON() });
  });

  getById = catchError(async (req: Request, res: Response): Promise<void> => {
    const employee = await this.service.getById(req.params.id as string);
    res.json({ status: "success", data: employee.toJSON() });
  });

  getAll = catchError(async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.getAll(req.query as any);
    res.json({
      status: "success",
      data: result.data.map((e) => e.toJSON()),
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  });

  update = catchError(async (req: Request, res: Response): Promise<void> => {
    const employee = await this.service.update(
      req.params.id as string,
      req.body,
    );
    res.json({ status: "success", data: employee.toJSON() });
  });

  deactivate = catchError(
    async (req: Request, res: Response): Promise<void> => {
      const employee = await this.service.deactivate(req.params.id as string);
      res.json({ status: "success", data: employee.toJSON() });
    },
  );
}
