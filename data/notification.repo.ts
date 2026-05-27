import { AbstractRepo } from "./base.repo.js";
import { NotificationModel } from "../models/notification.model.js";
import { INotification } from "../interface/notification.types.js";
import {
  NotificationChannelEnum,
  ChannelDeliveryStatusEnum,
  NotificationRecipientTypeEnum,
} from "../interface/enums/notification-enum.types.js";

export class NotificationRepo extends AbstractRepo<INotification> {
  constructor() {
    super(NotificationModel);
  }

  async findByRecipient(
    recipientId: string,
    recipientType: NotificationRecipientTypeEnum,
  ): Promise<INotification[]> {
    return this.model
      .find({ recipientId, recipientType })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnread(recipientId: string): Promise<INotification[]> {
    return this.model
      .find({ recipientId, readAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return this.model
      .findByIdAndUpdate(id, { readAt: new Date() }, { new: true })
      .exec();
  }

  async updateDeliveryStatus(
    id: string,
    channel: NotificationChannelEnum,
    status: ChannelDeliveryStatusEnum,
    failReason?: string,
  ): Promise<void> {
    await this.model
      .updateOne(
        { _id: id, "deliveries.channel": channel },
        {
          $set: {
            "deliveries.$.status": status,
            "deliveries.$.sentAt":
              status === ChannelDeliveryStatusEnum.SENT
                ? new Date()
                : undefined,
            "deliveries.$.failReason": failReason,
          },
          $inc: { "deliveries.$.attempts": 1 },
        },
      )
      .exec();
  }
}

export const notificationRepo = new NotificationRepo();
