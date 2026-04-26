import { Request, Response } from "express";
import { dashboardService } from "@/services/dashboard.service";
import { catchError } from "@/lib/catch.error";
import { STATUS_CODE } from "@/lib/statuscode";

export class DashboardController {
  getOverview = catchError(async (req: Request, res: Response) => {
    const data = await dashboardService.getOverview();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getProducts = catchError(async (req: Request, res: Response) => {
    const data = await dashboardService.getProductStats();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getAnalysis = catchError(async (req: Request, res: Response) => {
    const data = await dashboardService.getCategoryDistribution();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getSales = catchError(async (req: Request, res: Response) => {
    const data = await dashboardService.getSalesData();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getUsers = catchError(async (req: Request, res: Response) => {
    const data = await dashboardService.getRecentUsers();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });
}

export const dashboardController = new DashboardController();
