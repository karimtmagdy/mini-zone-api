import { EmailService, emailService } from "./email.service";

export class NotifyService {
  constructor(private emailService: EmailService) {}
}
export const notifyService = new NotifyService(emailService);
