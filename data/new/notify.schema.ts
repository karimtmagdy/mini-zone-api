import { z } from "zod/v4";
import {
  NotificationChannelEnum,
  NotificationRecipientTypeEnum,
} from "../unity/enums/notify-enums";
import { IdParamZod } from "./rules/shard.schema";
import { StandradQueryZod } from "./rules/query.schema";

export const CreateNotificationSchema = z.object({
  recipientId: IdParamZod,
  recipientType: z.nativeEnum(NotificationRecipientTypeEnum, {
    message: "Invalid recipient type",
  }),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  channels: z
    .array(
      z.nativeEnum(NotificationChannelEnum, { message: "Invalid channel" }),
    )
    .min(1, "At least one channel is required"),
  metadata: z.record(z.string(), z.unknown()).optional(),
  scheduledAt: z.coerce.date().optional(),
});
export const NotificationQuerySchema = StandradQueryZod.extend({
  recipientId: IdParamZod.optional(),
  recipientType: z
    .nativeEnum(NotificationRecipientTypeEnum, {
      message: "Invalid recipient type",
    })
    .optional(),
  unreadOnly: z.coerce.boolean().default(false),
});

export type CreateNotificationDTO = z.infer<typeof CreateNotificationSchema>;
export type NotificationQueryDTO = z.infer<typeof NotificationQuerySchema>;
