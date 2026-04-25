import nodemailer from "nodemailer";
import { enviro } from "@/lib/local.env";
import { logger } from "@/lib/logger";

export interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    // 1. Create a Transporter
    // This is essentially the connection to your email provider (Gmail, Outlook, etc.)
    this.transporter = nodemailer.createTransport({
      host: enviro.emailHost,
      port: Number(enviro.emailPort) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: enviro.emailUser,
        pass: enviro.emailPass,
      },
    });
  }

  /**
   * Send an email to a user
   * @param options Email details (to, subject, message)
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    // 2. Define email options
    const mailOptions = {
      from: `"A-Z Express Support" <${enviro.emailUser}>`,
      to: options.email,
      subject: options.subject,
      text: options.message, // Fallback plain text
      html: options.html || `<div>${options.message}</div>`, // HTML version
    };

    // 3. Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      logger.log(`📧 Email sent successfully to: ${options.email}`);
    } catch (error) {
      logger.error("❌ Error sending email:", error);
      throw new Error("Email could not be sent");
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
