import { z } from 'zod';

// ─── Shared ────────────────────────────────────────────────────────────────

export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

export const ObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

const PersonBaseSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName:  z.string().min(1).max(50).trim(),
  email:     EmailSchema,
  phone:     z.string().regex(/^\+?[\d\s\-()]{7,20}$/).optional(),
});

// ─── Employee ──────────────────────────────────────────────────────────────

export const CreateEmployeeSchema = PersonBaseSchema.extend({
  employeeId:  z.string().min(1).max(20),
  department:  z.string().min(1).max(100),
  jobTitle:    z.string().min(1).max(100),
  salary:      z.number().positive().optional(),
  hiredAt:     z.coerce.date().optional(),
  managerId:   ObjectIdSchema.optional(),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial().omit({ employeeId: true });

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;

// ─── User ──────────────────────────────────────────────────────────────────

export const CreateUserSchema = PersonBaseSchema.extend({
  password:    z.string().min(8, 'Password must be at least 8 characters'),
  role:        z.enum(['admin', 'manager', 'viewer']).default('viewer'),
  employeeId:  ObjectIdSchema.optional(), // link to Employee record
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

export const LoginSchema = z.object({
  email:    EmailSchema,
  password: z.string().min(1),
});

export type CreateUserDTO   = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO   = z.infer<typeof UpdateUserSchema>;
export type LoginDTO         = z.infer<typeof LoginSchema>;

// ─── Notification ──────────────────────────────────────────────────────────

export const CreateNotificationSchema = z.object({
  recipientId:  ObjectIdSchema,
  recipientType: z.enum(['user', 'employee']),
  title:         z.string().min(1).max(200),
  body:          z.string().min(1).max(2000),
  channels:      z.array(z.enum(['email', 'in_app', 'push', 'webhook'])).min(1),
  metadata:      z.record(z.unknown()).optional(),
  scheduledAt:   z.coerce.date().optional(),
});
export const NotificationQuerySchema = z.object({
  recipientId:   ObjectIdSchema.optional(),
  recipientType: z.enum(['user', 'employee']).optional(),
  unreadOnly:    z.coerce.boolean().default(false),
  page:          z.coerce.number().min(1).default(1),
  limit:         z.coerce.number().min(1).max(100).default(20),
});
export type CreateNotificationDTO = z.infer<typeof CreateNotificationSchema>;
export type NotificationQueryDTO    = z.infer<typeof NotificationQuerySchema>;
