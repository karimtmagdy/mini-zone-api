import { Router, json } from "express";
import { paymentController } from "@/controllers/payment.controller";

const router = Router();

// Webhook endpoint - Stripe requires raw body
router.post(
  "/stripe",
  json({ verify: (req, _res, buf) => ((req as any).rawBody = buf) }),
  paymentController.handleWebhook.bind(paymentController)
);

export { router as webhookRouter };
