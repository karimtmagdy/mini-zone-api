import { Router } from "express";
import { dashboardController } from "@/controllers/dashboard.controller";

const router = Router();

router.route("/products").get(dashboardController.getProducts);
router.route("/overview").get(dashboardController.getOverview);
router.route("/analysis").get(dashboardController.getAnalysis);
router.route("/sales").get(dashboardController.getSales);
router.route("/users").get(dashboardController.getUsers);
router.route("/settings").get((req, res) => {
  res.json({ message: "Admin settings" });
});

export default {
  path: "/dashboard",
  router,
};
