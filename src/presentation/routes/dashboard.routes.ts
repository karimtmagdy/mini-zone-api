import { Router } from "express";
import { dashboardCtrl } from "@/infrastructure/container/dashboard.container";
import { activityLogCtrl } from "@/infrastructure/container/activity-log.container";
import { authenticated } from "@/presentation/middlewares/authorized";

const router = Router();
router.use(authenticated);

router.route("/products").get(dashboardCtrl.getProducts);
router.route("/overview").get(dashboardCtrl.getOverview);
router.route("/analysis").get(dashboardCtrl.getAnalysis);
router.route("/sales").get(dashboardCtrl.getSales);
router.route("/sales/by-day").get(dashboardCtrl.getSalesByDay);
router.route("/users").get(dashboardCtrl.getUsers);
router.route("/activities").get(dashboardCtrl.getRecentActivities);
router.route("/logs").get(activityLogCtrl.getAllLogs);

router.route("/settings").get((req, res) => {
  res.json({ message: "Admin settings" });
});

export default {
  path: "/dashboard",
  router,
};
