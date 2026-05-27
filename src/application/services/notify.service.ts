import { EmailService, emailService } from "./email.service";

export class NotifyService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.emailService.sendEmail({
      email,
      subject: "Welcome to MiniZone!",
      message: `Hello ${name}, welcome to our platform! We're glad to have you here.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to MiniZone!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We're excited to have you join our community. Explore our latest features and start your journey with us.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The MiniZone Team</p>
        </div>
      `,
    });
  }

  async sendAdminActionNotification(adminEmail: string, action: string, target: string) {
    // Optional: send email to super-admin or similar when an admin performs an action
  }
}

export const notifyService = new NotifyService(emailService);
