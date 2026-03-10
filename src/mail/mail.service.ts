import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  @OnEvent('user.logged_in')
  async sendLoginNotification(user: { email: string; firstName: string; lastName: string }): Promise<void> {
    try {
      const loginTime = new Date().toLocaleString('en-US', {
        timeZoneName: 'short',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4a90e2; margin: 0; font-size: 28px; font-weight: 700;">Gatherly</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9fc; border-radius: 8px;">
          <h2 style="color: #333333; margin-top: 0; font-size: 20px;">New Login Detected</h2>
          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Hello <strong>${user.firstName} ${user.lastName}</strong>,
          </p>
          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            We noticed a successful login to your Gatherly account right now.
          </p>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #4a90e2; border-radius: 4px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #333333; font-size: 15px;">
              <strong>Account:</strong> <a href="mailto:${user.email}" style="color: #4a90e2; text-decoration: none;">${user.email}</a>
            </p>
            <p style="margin: 0; color: #333333; font-size: 15px;">
              <strong>Time:</strong> ${loginTime}
            </p>
          </div>
          
          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            If this was you, you can safely ignore this email. Your account is secure.
          </p>
          <p style="color: #d9534f; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
            <strong>Did not log in recently?</strong> Please secure your account by changing your password immediately and contacting support.
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; color: #aaa; font-size: 13px;">
          <p style="margin: 0 0 5px 0;">Gatherly Security Team</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Gatherly. All rights reserved.</p>
        </div>
      </div>
      `;

      await this.transporter.sendMail({
        from: '"Gatherly Security" <umarextra000@gmail.com>',
        to: user.email,
        subject: 'Security Alert: New login to your account',
        html: htmlTemplate,
      });

      this.logger.log(`Login notification email sent to ${user.email}`);
    } catch (error) {
      this.logger.error('Error sending login notification email:', error);
    }
  }
}
