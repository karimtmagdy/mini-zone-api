import { Request, Response } from "express";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { GetOverview } from "@/application/use-cases/dashboard/getOverview";
import { GetProductStats } from "@/application/use-cases/dashboard/getProductStats";
import { GetCategoryDistribution } from "@/application/use-cases/dashboard/getCategoryDistribution";
import { GetRecentUsers } from "@/application/use-cases/dashboard/getRecentUsers";
import { GetSalesData, SalesPeriod } from "@/application/use-cases/dashboard/getSalesData";
import { GetSalesByDay } from "@/application/use-cases/dashboard/getSalesByDay";
import { GetRecentActivities } from "@/application/use-cases/dashboard/getRecentActivities";

export class DashboardController {
  constructor(
    private getOverviewUseCase: GetOverview,
    private getProductStatsUseCase: GetProductStats,
    private getCategoryDistributionUseCase: GetCategoryDistribution,
    private getRecentUsersUseCase: GetRecentUsers,
    private getSalesDataUseCase: GetSalesData,
    private getSalesByDayUseCase: GetSalesByDay,
    private getRecentActivitiesUseCase: GetRecentActivities,
  ) {}

  getOverview = catchError(async (req: Request, res: Response) => {
    const data = await this.getOverviewUseCase.execute();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getProducts = catchError(async (req: Request, res: Response) => {
    const data = await this.getProductStatsUseCase.execute();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getAnalysis = catchError(async (req: Request, res: Response) => {
    const data = await this.getCategoryDistributionUseCase.execute();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getSales = catchError(async (req: Request, res: Response) => {
    const period = (req.query.period as SalesPeriod) || "monthly";
    const data = await this.getSalesDataUseCase.execute(period);
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getSalesByDay = catchError(async (req: Request, res: Response) => {
    const data = await this.getSalesByDayUseCase.execute();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getUsers = catchError(async (req: Request, res: Response) => {
    const data = await this.getRecentUsersUseCase.execute();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });

  getRecentActivities = catchError(async (req: Request, res: Response) => {
    const data = await this.getRecentActivitiesUseCase.execute();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data,
    });
  });
}
