import { Express } from "express";
import { Route } from "@/types/global.dto";
import brandRouter from "@/router/brand.routes";
import categoryRouter from "@/router/category.routes";
import subcategoryRouter from "@/router/subcategory.routes";
import dashboardRouter from "@/router/dashboard.routes";
import authRouter from "@/router/auth.routes";
import productRouter from "@/router/product.routes";

const publicRoutes: Route[] = [
  brandRouter,
  categoryRouter,
  subcategoryRouter,
  dashboardRouter,
  authRouter,
  productRouter,
];

const RV1 = "/api/v1";

export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};
