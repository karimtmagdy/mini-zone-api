import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { catchError } from "../lib/catch.error.js";
import { STATUS_CODE } from "../lib/statuscode.js";
import { ResponseDto } from "../rules/response.rule.js";

export class DashboardController {
  getStats = catchError(async (req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    const response: ResponseDto<any> = {
      status: "success",
      message: "Dashboard statistics retrieved successfully",
      data: stats,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

export const dashboardController = new DashboardController();
