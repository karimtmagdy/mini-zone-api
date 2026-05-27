import axios from 'axios';
import { NotificationRepository, EmployeeRepository, UserRepository } from '../repositories';
import { EmailService } from './email.service';
import { CreateNotificationDTO } from '../schemas';
import { INotification, NotificationChannel } from '../models/notification.model';

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly userRepo:         UserRepository,
    private readonly employeeRepo:     EmployeeRepository,
    private readonly emailService:     EmailService
  ) {}

  async create(dto: CreateNotificationDTO): Promise<INotification> {
    // Build initial delivery records for each channel
    const deliveries = dto.channels.map(channel => ({
      channel,
      status:   'pending' as const,
      attempts: 0,
    }));

    const notification = await this.notificationRepo.create({
      ...dto,
      deliveries,
    } as any);

    // Dispatch immediately unless scheduled
    if (!dto.scheduledAt || dto.scheduledAt <= new Date()) {
      await this.dispatch(notification);
    }

    return notification;
  }

  private async dispatch(notification: INotification): Promise<void> {
    const recipient = await this.resolveRecipient(
      notification.recipientId.toString(),
      notification.recipientType
    );

    if (!recipient) {
      console.error(`Notification ${notification._id}: recipient not found`);
      return;
    }

    const dispatchMap: Record<NotificationChannel, () => Promise<void>> = {
      email:   () => this.dispatchEmail(notification, recipient),
      in_app:  () => this.dispatchInApp(notification),
      push:    () => this.dispatchPush(notification, recipient),
      webhook: () => this.dispatchWebhook(notification),
    };

    await Promise.allSettled(
      notification.channels.map(channel =>
        dispatchMap[channel]()
          .then(() =>
            this.notificationRepo.updateDeliveryStatus(
              notification._id.toString(), channel, 'sent'
            )
          )
          .catch(err =>
            this.notificationRepo.updateDeliveryStatus(
              notification._id.toString(), channel, 'failed', err.message
            )
          )
      )
    );
  }

  private async dispatchEmail(
    notification: INotification,
    recipient: { email: string; firstName: string; lastName: string }
  ): Promise<void> {
    await this.emailService.sendNotificationEmail(
      recipient.email,
      `${recipient.firstName} ${recipient.lastName}`,
      notification.title,
      notification.body
    );
  }

  private async dispatchInApp(notification: INotification): Promise<void> {
    // In-app is already DB-stored; just mark as sent
    // Extend here to emit via Socket.IO if needed
    console.log(`[IN_APP] Notification ${notification._id} delivered to DB`);
  }

  private async dispatchPush(
    notification: INotification,
    recipient: { email: string }
  ): Promise<void> {
    // Placeholder — integrate FCM / APNs / Web Push here
    console.log(`[PUSH] Would push to ${recipient.email}: ${notification.title}`);
  }

  private async dispatchWebhook(notification: INotification): Promise<void> {
    const url = process.env.WEBHOOK_URL;
    if (!url) throw new Error('WEBHOOK_URL not configured');

    await axios.post(url, {
      event:     'notification.sent',
      id:        notification._id.toString(),
      title:     notification.title,
      body:      notification.body,
      recipient: {
        id:   notification.recipientId.toString(),
        type: notification.recipientType,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private async resolveRecipient(id: string, type: 'user' | 'employee') {
    if (type === 'user') {
      return this.userRepo.findById(id);
    }
    return this.employeeRepo.findById(id);
  }

  async getForRecipient(recipientId: string, recipientType: 'user' | 'employee') {
    return this.notificationRepo.findByRecipient(recipientId, recipientType);
  }

  async markRead(id: string) {
    return this.notificationRepo.markAsRead(id);
  }
}
