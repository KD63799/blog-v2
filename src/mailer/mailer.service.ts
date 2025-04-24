import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  async sendSignupConfirmation(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Bienvenue sur le blog',
      html: '<h1>Comfirmation de votre inscription</h1>',
    });
  }

  async sendResetPassword(userEmail: string, url: string, code: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Récuperation de mot de passe',
      html: `
                    <a href="${url}">Recupération mot de passe</a>
                    <p>Votre code secret <strong>${code}</strong></p>
                    <p>Votre code expire dans 15 minutes</p>
                `,
    });
  }

  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }
}
