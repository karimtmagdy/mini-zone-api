import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

export interface EmailPayload {
  to:       string | string[];
  subject:  string;
  html:     string;
  text?:    string;
  cc?:      string[];
  replyTo?: string;
}

export interface EmailResult {
  messageId: string;
  accepted:  string[];
  rejected:  string[];
}

/**
 * EmailService — wraps Nodemailer for transactional email delivery.
 * Configured via environment variables. Use `send()` for all outbound email.
 */
export class EmailService {
  private transporter: Transporter;
  private readonly fromAddress: string;

  constructor() {
    this.fromAddress = process.env.EMAIL_FROM ?? 'noreply@example.com';

    this.transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   ?? 'smtp.example.com',
      port:   Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(payload: EmailPayload): Promise<EmailResult> {
    const options: SendMailOptions = {
      from:    this.fromAddress,
      to:      Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
      subject: payload.subject,
      html:    payload.html,
      text:    payload.text,
      cc:      payload.cc,
      replyTo: payload.replyTo,
    };

    const info = await this.transporter.sendMail(options);

    return {
      messageId: info.messageId,
      accepted:  info.accepted as string[],
      rejected:  info.rejected as string[],
    };
  }

  async sendNotificationEmail(
    recipientEmail: string,
    recipientName:  string,
    title:          string,
    body:           string
  ): Promise<EmailResult> {
    return this.send({
      to:      recipientEmail,
      subject: title,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#1a1a2e">${title}</h2>
          <p>Hi ${recipientName},</p>
          <p>${body}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <small style="color:#999">You received this notification from the system.</small>
        </div>
      `,
      text: `Hi ${recipientName},\n\n${title}\n\n${body}`,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}
