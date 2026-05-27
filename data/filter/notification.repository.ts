import { AbstractRepository } from '../../shared/base.repository';
import { NotificationModel, INotification } from './notification.model';

export class NotificationRepository extends AbstractRepository<INotification> {
  constructor() { super(NotificationModel); }

  async findByRecipient(
    recipientId:   string,
    recipientType: INotification['recipientType']
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
    id:          string,
    channel:     string,
    status:      string,
    failReason?: string
  ): Promise<void> {
    await this.model.updateOne(
      { _id: id, 'deliveries.channel': channel },
      {
        $set: {
          'deliveries.$.status':     status,
          'deliveries.$.sentAt':     status === 'sent' ? new Date() : undefined,
          'deliveries.$.failReason': failReason,
        },
        $inc: { 'deliveries.$.attempts': 1 },
      }
    ).exec();
  }
}
