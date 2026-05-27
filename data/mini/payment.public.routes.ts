import { Router } from "express";
import { paymentController } from "@/controllers/payment.controller";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();

// Create Checkout Session (Authenticated users only)
router.post(
  "/checkout",
  authenticate,
  paymentController.createCheckoutSession.bind(paymentController)
);

export { router as paymentPublicRouter };
