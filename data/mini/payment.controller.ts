import { Request, Response } from "express";
import { paymentService } from "@/services/payment.service";
import { Order } from "@/models/order.model";
import { AppError } from "@/middleware/api.error";
import Stripe from "stripe";
import { logger } from "@/lib/logger";

export class PaymentController {
  /**
   * Create a Stripe Checkout Session
   * POST /api/v1/payment/checkout
   */
  async createCheckoutSession(req: Request, res: Response) {
    const userId = req.user?._id;
    if (!userId) throw new AppError(401, "Unauthorized");

    const { cart, shippingAddress } = req.body;

    if (!cart || cart.length === 0) {
      throw new AppError(400, "Cart is empty");
    }

    // Create a pending order
    const order = await Order.create({
      user: userId,
      orderItems: cart,
      shippingAddress,
      itemsPrice: cart.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      ),
      taxPrice: 0, // You can calculate tax here
      shippingPrice: 10, // Static for now
      totalPrice:
        cart.reduce(
          (acc: number, item: any) => acc + item.price * item.quantity,
          0
        ) + 10,
    });

    // Create Stripe Checkout Session
    const session = await paymentService.createCheckoutSession(
      cart.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      req.user!.email,
      order._id.toString()
    );

    // Save session ID to order
    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({
      status: "success",
      sessionId: session.id,
      url: session.url,
    });
  }

  /**
   * Handle Stripe Webhook
   * POST /api/v1/webhooks/stripe
   */
  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = paymentService.constructWebhookEvent(req.body, sig);
    } catch (err: any) {
      logger.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await this.fulfillOrder(session);
        break;
      default:
        logger.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  /**
   * Fulfill the order after payment success
   */
  private async fulfillOrder(session: Stripe.Checkout.Session) {
    const orderId = session.client_reference_id;
    if (!orderId) {
      logger.error("No order ID found in session");
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      logger.error(`Order ${orderId} not found`);
      return;
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: session.payment_intent as string,
      status: session.payment_status,
      updateTime: new Date(),
      emailAddress: session.customer_email || "",
    };

    await order.save();
    logger.log(`✅ Order ${orderId} marked as paid`);
  }
}

export const paymentController = new PaymentController();
