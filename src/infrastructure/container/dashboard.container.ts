import { GetOverview } from "@/application/use-cases/dashboard/getOverview";
import { GetProductStats } from "@/application/use-cases/dashboard/getProductStats";
import { GetCategoryDistribution } from "@/application/use-cases/dashboard/getCategoryDistribution";
import { GetRecentUsers } from "@/application/use-cases/dashboard/getRecentUsers";
import { GetSalesData } from "@/application/use-cases/dashboard/getSalesData";
import { GetSalesByDay } from "@/application/use-cases/dashboard/getSalesByDay";
import { GetRecentActivities } from "@/application/use-cases/dashboard/getRecentActivities";
import { DashboardController } from "@/presentation/controllers/dashboard.controller";

export const getOverviewUseCase = new GetOverview();
export const getProductStatsUseCase = new GetProductStats();
export const getCategoryDistributionUseCase = new GetCategoryDistribution();
export const getRecentUsersUseCase = new GetRecentUsers();
export const getSalesDataUseCase = new GetSalesData();
export const getSalesByDayUseCase = new GetSalesByDay();
export const getRecentActivitiesUseCase = new GetRecentActivities();

export const dashboardCtrl = new DashboardController(
  getOverviewUseCase,
  getProductStatsUseCase,
  getCategoryDistributionUseCase,
  getRecentUsersUseCase,
  getSalesDataUseCase,
  getSalesByDayUseCase,
  getRecentActivitiesUseCase,
);
