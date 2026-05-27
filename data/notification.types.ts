import { Document, Types } from "mongoose";
import {
  NotificationChannelEnum,
  ChannelDeliveryStatusEnum,
  NotificationRecipientTypeEnum,
} from "./enums/notification-enum.types.js";

export interface IChannelDelivery {
  channel: NotificationChannelEnum;
  status: ChannelDeliveryStatusEnum;
  sentAt?: Date;
  failReason?: string;
  attempts: number;
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipientId: Types.ObjectId;
  recipientType: NotificationRecipientTypeEnum;
  title: string;
  body: string;
  channels: NotificationChannelEnum[];
  deliveries: IChannelDelivery[];
  metadata?: Record<string, unknown>;
  scheduledAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
