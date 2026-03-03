import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service.js";

export class UserController {
  constructor(protected userService: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createByAdmin(req.body);
      res.status(201).json({
        status: "success",
        message: "user has been created",
        data: user.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id as string);
      res.status(200).json({
        status: "success",
        data: user.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };
      const result = await this.userService.getAll(query);
      res.status(200).json({
        status: "success",
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        },
        data: result.data.map((u) => u.toJSON()),
      });
    } catch (err) {
      next(err);
    }
  };

  updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.update(req.params.id as string, req.body);
      res.status(200).json({
        status: "success",
        message: "user has been updated",
        data: user.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };

  deactivateByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.deactivateByAdmin(req.params.id as string);
      res.status(200).json({
        status: "success",
        message: "user has been deactivated",
        data: user.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };
}
