import { Schema, model, Document, Types } from 'mongoose';

// ─── Types ─────────────────────────────────────────────────────────────────

export type NotificationChannel  = 'email' | 'in_app' | 'push' | 'webhook';
export type NotificationStatus   = 'pending' | 'sent' | 'failed' | 'read';
export type NotificationRecipientType = 'user' | 'employee';

export interface IChannelDelivery {
  channel:     NotificationChannel;
  status:      NotificationStatus;
  sentAt?:     Date;
  failReason?: string;
  attempts:    number;
}

export interface INotification extends Document {
  _id:           Types.ObjectId;
  recipientId:   Types.ObjectId;
  recipientType: NotificationRecipientType;
  title:         string;
  body:          string;
  channels:      NotificationChannel[];
  deliveries:    IChannelDelivery[];
  metadata?:     Record<string, unknown>;
  scheduledAt?:  Date;
  readAt?:       Date;
  createdAt:     Date;
  updatedAt:     Date;
}

// ─── Mongoose Schema ───────────────────────────────────────────────────────

const ChannelDeliverySchema = new Schema<IChannelDelivery>(
  {
    channel:    { type: String, enum: ['email', 'in_app', 'push', 'webhook'], required: true },
    status:     { type: String, enum: ['pending', 'sent', 'failed', 'read'], default: 'pending' },
    sentAt:     { type: Date },
    failReason: { type: String },
    attempts:   { type: Number, default: 0 },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotification>(
  {
    recipientId:   { type: Schema.Types.ObjectId, required: true },
    recipientType: { type: String, enum: ['user', 'employee'], required: true },
    title:         { type: String, required: true },
    body:          { type: String, required: true },
    channels:      [{ type: String, enum: ['email', 'in_app', 'push', 'webhook'] }],
    deliveries:    [ChannelDeliverySchema],
    metadata:      { type: Schema.Types.Mixed },
    scheduledAt:   { type: Date },
    readAt:        { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientId: 1, recipientType: 1 });
NotificationSchema.index({ 'deliveries.status': 1 });
NotificationSchema.index({ scheduledAt: 1 });

export const NotificationModel = model<INotification>('Notification', NotificationSchema);
