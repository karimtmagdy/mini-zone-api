import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import { IdParamZod } from "@/shared/schema/shard.schema";
import {
  createOrderZod,
  updateOrderStatusZod,
  updatePaymentStatusZod,
} from "@/_R/order.schema";
import { orderCtrl } from "@/_R/order.controller";
import {
  authenticated,
  checkPermission,
} from "@/presentation/middlewares/authorized";

const router = Router();

router.use(authenticated);

// My orders (Customer)
router.get("/myorders", orderCtrl.getMyOrders);

// Create order (Customer/Admin)
router.post("/", validate(createOrderZod), orderCtrl.create);

// Admin only endpoints
router.use(checkPermission(["admin", "super-admin"]));

router.get("/", orderCtrl.getAll);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), orderCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    validate(updateOrderStatusZod),
    orderCtrl.updateStatus,
  );

router.patch(
  "/:id/payment",
  validate(IdParamZod, "params"),
  validate(updatePaymentStatusZod),
  orderCtrl.updatePaymentStatus,
);

export default {
  path: "/orders",
  router,
};
