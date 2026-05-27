import { Schema, model, Types } from "mongoose";
import {
  NotificationChannelEnum,
  ChannelDeliveryStatusEnum,
  NotificationRecipientTypeEnum,
} from "../interface/enums/notification-enum.types.js";
import {
  IChannelDelivery,
  INotification,
} from "../interface/notification.types.js";

const ChannelDeliverySchema = new Schema<IChannelDelivery>(
  {
    channel: {
      type: String,
      enum: Object.values(NotificationChannelEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ChannelDeliveryStatusEnum),
      default: ChannelDeliveryStatusEnum.PENDING,
    },
    sentAt: { type: Date },
    failReason: { type: String },
    attempts: { type: Number, default: 0 },
  },
  { _id: false },
);

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true },
    recipientType: {
      type: String,
      enum: Object.values(NotificationRecipientTypeEnum),
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    channels: [{ type: String, enum: Object.values(NotificationChannelEnum) }],
    deliveries: [ChannelDeliverySchema],
    metadata: { type: Schema.Types.Mixed },
    scheduledAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true },
);

NotificationSchema.index({ recipientId: 1, recipientType: 1 });
NotificationSchema.index({ "deliveries.status": 1 });
NotificationSchema.index({ scheduledAt: 1 });

export const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema,
);
