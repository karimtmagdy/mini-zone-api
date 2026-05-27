import Stripe from "stripe";
import { jwtConfig } from "@/config/jwt.config";

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    // 1. Initialize Stripe with the Secret Key
    this.stripe = new Stripe(jwtConfig.stripeSecretKey || "", {
      // apiVersion: "2023-10-16", // Let the library choose the default or defined in package
      typescript: true,
    });
  }

  /**
   * Create a Stripe Checkout Session for a user's cart
   * @param items List of items to purchase
   * @param userEmail User's email for receipt
   * @param orderId Internal Order ID to track (will be sent in metadata)
   * @returns Session URL and ID
   */
  async createCheckoutSession(
    items: {
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[],
    userEmail: string,
    orderId: string
  ) {
    // 2. Map cart items to Stripe Line Items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd", // Standardize currency
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    // 3. Create the Session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${
        jwtConfig.clientUrl || jwtConfig.frontendUrl
      }/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${jwtConfig.clientUrl || jwtConfig.frontendUrl}/cart`,
      customer_email: userEmail,
      client_reference_id: orderId, // Essential for matching webhook events later
      metadata: {
        orderId: orderId,
      },
    });

    return session;
  }

  /**
   * Validate a Webhook Event
   * This ensures the request actually came from Stripe
   */
  constructWebhookEvent(payload: string | Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      jwtConfig.stripeWebhookSecret || ""
    );
  }
}

export const paymentService = new PaymentService();
