export const NOTIFICATION_CHANNELS = [
  "email",
  "in_app",
  "push",
  "webhook",
] as const;
export const CHANNEL_DELIVERY_STATUSES = [
  "pending",
  "sent",
  "failed",
  "read",
] as const;
export const NOTIFICATION_RECIPIENT_TYPES = ["user", "employee"] as const;
export const NOTIFICATION_TYPES = [
  "order",
  "review",
  "discount",
  "other",
] as const;
export const NOTIFICATION_PRIORITIES = ["high", "medium", "low"] as const;
export const NOTIFICATION_ACTIONS = [
  "view",
  "edit",
  "delete",
  "other",
] as const;
export const NOTIFICATION_CATEGORIES = [
  "order",
  "review",
  "discount",
  "other",
] as const;
export const NOTIFICATION_MARKED_STATUSES = ["read", "unread"] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];
export type ChannelDeliveryStatus = (typeof CHANNEL_DELIVERY_STATUSES)[number];
export type NotificationMarkedStatus =
  (typeof NOTIFICATION_MARKED_STATUSES)[number];
export type NotificationRecipientType =
  (typeof NOTIFICATION_RECIPIENT_TYPES)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type NotificationAction = (typeof NOTIFICATION_ACTIONS)[number];
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];
