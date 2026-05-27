import nodemailer from "nodemailer";
import { enviro } from "@/shared/lib/local.env";
import { logger } from "@/shared/lib/logger";

export interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: enviro.emailHost,
      port: Number(enviro.emailPort) || 587,
      secure: false, 
      auth: {
        user: enviro.emailUser,
        pass: enviro.emailPass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: `"MiniZone Support" <${enviro.emailUser}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<div>${options.message}</div>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.log(`📧 Email sent successfully to: ${options.email}`);
    } catch (error) {
      logger.error("❌ Error sending email:", error);
      throw new Error("Email could not be sent");
    }
  }
}

export const emailService = new EmailService();
