import axios from 'axios';
import { AbstractGuardedService }   from '../../shared/guard.service';
import { Permission }               from '../../config/rbac';
import { AuthUser }                 from '../../types/auth.types';
import { NotificationRepository }  from './notification.repository';
import { EmailService }             from './email.service';
import { INotification, NotificationChannel } from './notification.model';
import { CreateNotificationDTO }    from './notification.schema';
import { UserRepository }           from '../user/user.repository';
import { EmployeeRepository }       from '../employee/employee.repository';

export class NotificationService extends AbstractGuardedService {
  constructor(
    private readonly notifRepo:    NotificationRepository,
    private readonly userRepo:     UserRepository,
    private readonly employeeRepo: EmployeeRepository,
    private readonly emailService: EmailService
  ) { super(); }

  async create(dto: CreateNotificationDTO, actor: AuthUser): Promise<INotification> {
    this.assertPermission(actor, Permission.NOTIFICATION_CREATE);

    const deliveries = dto.channels.map(channel => ({
      channel, status: 'pending' as const, attempts: 0,
    }));

    const notification = await this.notifRepo.create({ ...dto, deliveries } as any);

    if (!dto.scheduledAt || dto.scheduledAt <= new Date()) {
      // Fire-and-forget dispatch — don't await to keep response fast
      this.dispatch(notification).catch(err =>
        console.error(`[Notification dispatch error] ${notification._id}:`, err)
      );
    }

    return notification;
  }

  async getForRecipient(
    recipientId:   string,
    recipientType: 'user' | 'employee',
    actor:         AuthUser
  ): Promise<INotification[]> {
    // Users can read their own; managers/admins can read all
    const isSelf = actor.id === recipientId;
    if (!isSelf) this.assertPermission(actor, Permission.NOTIFICATION_MANAGE);

    return this.notifRepo.findByRecipient(recipientId, recipientType);
  }

  async markRead(id: string, actor: AuthUser): Promise<INotification | null> {
    this.assertPermission(actor, Permission.NOTIFICATION_READ);
    return this.notifRepo.markAsRead(id);
  }

  async getAll(actor: AuthUser): Promise<INotification[]> {
    this.assertPermission(actor, Permission.NOTIFICATION_MANAGE);
    const result = await this.notifRepo.findAll();
    return result.data;
  }

  private async dispatch(notification: INotification): Promise<void> {
    const recipient = await this.resolveRecipient(
      notification.recipientId.toString(),
      notification.recipientType
    );
    if (!recipient) return;

    const handlers: Record<NotificationChannel, () => Promise<void>> = {
      email:   () => this.emailService.sendNotification(
        recipient.email,
        `${recipient.firstName} ${recipient.lastName}`,
        notification.title,
        notification.body
      ),
      in_app:  () => Promise.resolve(), // DB-stored; optionally emit via Socket.IO
      push:    () => this.dispatchPush(notification),
      webhook: () => this.dispatchWebhook(notification),
    };

    await Promise.allSettled(
      notification.channels.map(channel =>
        handlers[channel]()
          .then(() => this.notifRepo.updateDeliveryStatus(notification._id.toString(), channel, 'sent'))
          .catch(err => this.notifRepo.updateDeliveryStatus(notification._id.toString(), channel, 'failed', err.message))
      )
    );
  }

  private async dispatchPush(notification: INotification): Promise<void> {
    // Integrate FCM / APNs / Web Push here
    console.log(`[PUSH] ${notification._id}: ${notification.title}`);
  }

  private async dispatchWebhook(notification: INotification): Promise<void> {
    const url = process.env.WEBHOOK_URL;
    if (!url) throw new Error('WEBHOOK_URL not configured');
    await axios.post(url, {
      event: 'notification.sent', id: notification._id.toString(),
      title: notification.title, body: notification.body,
      recipient: { id: notification.recipientId.toString(), type: notification.recipientType },
      timestamp: new Date().toISOString(),
    });
  }

  private async resolveRecipient(id: string, type: 'user' | 'employee') {
    return type === 'user' ? this.userRepo.findById(id) : this.employeeRepo.findById(id);
  }
}
