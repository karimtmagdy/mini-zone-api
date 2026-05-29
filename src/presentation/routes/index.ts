import { Express } from "express";
import { Route } from "@/types/global.dto";

import productRouter from "./product.routes";
import subcategoryRouter from "./subcategory.routes";
import dashboardRouter from "./dashboard.routes";
import authRouter from "./auth.routes";
import employeeRouter from "./employee.routes";
import couponRouter from "./coupon.routes";
import brandRouter from "./brand.routes";
import categoryRouter from "./category.routes";
import userRouter from "./user.routes";

const publicRoutes: Route[] = [
  userRouter,
  productRouter,
  brandRouter,
  categoryRouter,
  subcategoryRouter,
  dashboardRouter,
  authRouter,
  employeeRouter,
  couponRouter,
];

const RV1 = "/api/v1";

export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};
