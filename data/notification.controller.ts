import { Request, Response, NextFunction } from "express";
import {
  NotificationService,
  notifyService,
} from "../service/events/notification.service.js";
import { NotificationRecipientTypeEnum } from "../interface/enums/notification-enum.types.js";

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const notification = await this.service.create(req.body, req.user);
      res.status(201).json({ success: true, data: notification });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const notifications = await this.service.getAll(req.user);
      res.json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  };

  getForRecipient = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id, type } = req.params as {
        id: string;
        type: NotificationRecipientTypeEnum;
      };
      const notifications = await this.service.getForRecipient(
        id,
        type,
        req.user,
      );
      res.json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  };

  markRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const notification = await this.service.markRead(
        req.params.id as string,
        req.user,
      );
      res.json({ success: true, data: notification });
    } catch (err) {
      next(err);
    }
  };
}
export const notifyCtrl = new NotificationController(notifyService);
