import { Express } from "express";
import { Route } from "../unity/core/global.dto.js";
import brandRouter from "./brand.routes.js";
import categoryRouter from "./category.routes.js";

const publicRoutes: Route[] = [brandRouter, categoryRouter];

const RV1 = "/api/v1";

export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};
