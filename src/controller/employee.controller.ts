import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../service/employee.service.js";

export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employee = await this.service.create(req.body);
      res.status(201).json({ success: true, data: employee.toJSON() });
    } catch (err) {
      next(err);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employee = await this.service.getById(req.params.id as string);
      res.json({ success: true, data: employee.toJSON() });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.getAll(req.query as any);
      res.json({
        success: true,
        data: result.data.map((e) => e.toJSON()),
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employee = await this.service.update(
        req.params.id as string,
        req.body,
      );
      res.json({ success: true, data: employee.toJSON() });
    } catch (err) {
      next(err);
    }
  };

  deactivate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const employee = await this.service.deactivate(req.params.id as string);
      res.json({ success: true, data: employee.toJSON() });
    } catch (err) {
      next(err);
    }
  };
}
