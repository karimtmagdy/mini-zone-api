import { Express } from "express";
import { Route } from "@/_R/types/global.dto";

import productRouter from "./product.routes";
import subcategoryRouter from "./subcategory.routes";
// import dashboardRouter from "./dashboard.routes";
// import authRouter from "./person/auth.routes";
// import userRouter from "./person/user.routes";
// import employeeRouter from "./person/employee.routes";
// import couponRouter from "./coupon.routes";
// import orderRouter from "./order.routes";
import brandRouter from "./brand.routes";
import categoryRouter from "./category.routes";

const publicRoutes: Route[] = [
  productRouter,
  brandRouter,
  categoryRouter,
  subcategoryRouter,
  //   dashboardRouter,
  //   authRouter,
  //   userRouter,
  //   employeeRouter,
  //   couponRouter,
  //   orderRouter,
];

const RV1 = "/api/v1";

export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};
