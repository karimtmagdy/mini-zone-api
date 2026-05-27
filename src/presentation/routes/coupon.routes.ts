import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import { IdParamZod, MultipleBulkZod } from "@/shared/schema/shard.schema";
import {
  createCouponZod,
  updateCouponZod,
  applyCouponZod,
  bulkGenerateZod,
} from "@/presentation/validation/coupon.zod";
import { couponCtrl } from "@/infrastructure/container/coupon.container";
import {
  authenticated,
  checkPermission,
} from "@/presentation/middlewares/authroized";

const router = Router();

router.use(authenticated);

// Apply endpoint (Public/User)
router.post("/apply", validate(applyCouponZod), couponCtrl.apply);

// Admin and Super Admin endpoints
router.use(checkPermission(["admin", "super-admin"]));

router.post("/generate", validate(bulkGenerateZod), couponCtrl.generateBulk);

router
  .route("/")
  .get(couponCtrl.getAll)
  .post(validate(createCouponZod), couponCtrl.create)
  .delete(validate(MultipleBulkZod), couponCtrl.deleteBulk);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), couponCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    validate(updateCouponZod),
    couponCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), couponCtrl.delete);

export default {
  path: "/coupons",
  router,
};
