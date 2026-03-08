export const ORDER_STATUS = [
  "pending",
  "shipped",
  "out_for_delivery",
  "confirmed",
  "processing",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];
