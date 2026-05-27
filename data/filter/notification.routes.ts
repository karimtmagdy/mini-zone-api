import { Router }          from 'express';
import { authenticate }      from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { validate }          from '../../middleware/validate.middleware';
import { Permission }        from '../../config/rbac';
import { NotificationRepository } from './notification.repository';
import { UserRepository }         from '../user/user.repository';
import { EmployeeRepository }     from '../employee/employee.repository';
import { EmailService }           from './email.service';
import { NotificationService }    from './notification.service';
import { NotificationController } from './notification.controller';
import { CreateNotificationSchema } from './notification.schema';

const notifRepo    = new NotificationRepository();
const userRepo     = new UserRepository();
const employeeRepo = new EmployeeRepository();
const emailService = new EmailService();
const service      = new NotificationService(notifRepo, userRepo, employeeRepo, emailService);
const controller   = new NotificationController(service);

export const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get(
  '/',
  requirePermission(Permission.NOTIFICATION_MANAGE),
  controller.getAll
);

notificationRouter.get(
  '/recipient/:type/:id',
  requirePermission(Permission.NOTIFICATION_READ),
  controller.getForRecipient
);

notificationRouter.post(
  '/',
  requirePermission(Permission.NOTIFICATION_CREATE),
  validate(CreateNotificationSchema),
  controller.create
);

notificationRouter.patch(
  '/:id/read',
  requirePermission(Permission.NOTIFICATION_READ),
  controller.markRead
);
