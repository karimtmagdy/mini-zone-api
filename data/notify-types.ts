export const NOTIFY_CHANNELS = ["email", "in_app", "push", "webhook"] as const;
export const CHANNEL_DELIVERY_STATUSES = [
  "pending",
  "sent",
  "failed",
  "read",
] as const;
export const NOTIFY_RECIPIENT_TYPES = ["user", "employee"] as const;
export const NOTIFY_TYPES = ["order", "review", "discount", "other"] as const;
export const NOTIFY_PRIORITY = ["high", "medium", "low"] as const;
export const NOTIFY_ACTIONS = ["view", "edit", "delete", "other"] as const;
export const NOTIFY_CATEGORY = [
  "order",
  "review",
  "discount",
  "other",
] as const;
export const NOTIFY_MARKED_STATUSES = ["read", "unread"] as const;

export type NotifyCategory = (typeof NOTIFY_CATEGORY)[number];
export type ChannelDeliveryStatus = (typeof CHANNEL_DELIVERY_STATUSES)[number];
export type NotifyMarkedStatus = (typeof NOTIFY_MARKED_STATUSES)[number];
export type NotifyRecipientType = (typeof NOTIFY_RECIPIENT_TYPES)[number];
export type NotifyType = (typeof NOTIFY_TYPES)[number];
export type NotifyAction = (typeof NOTIFY_ACTIONS)[number];
export type NotifyChannel = (typeof NOTIFY_CHANNELS)[number];
export type NotifyPriority = (typeof NOTIFY_PRIORITY)[number];
