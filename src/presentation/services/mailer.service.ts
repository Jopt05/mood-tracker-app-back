import { Client } from 'node-mailjet';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
}

export class EmailService {

  private client: Client;

  constructor(
    apiKey: string,
    secretKey: string,
    private readonly fromEmail: string,
    private readonly postToProvider: boolean,
  ) {
    this.client = new Client({ apiKey, apiSecret: secretKey });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody } = options;

    if (!this.postToProvider) return true;

    const recipients = Array.isArray(to)
      ? to.map(email => ({ Email: email }))
      : [{ Email: to }];

    try {
      const result = await this.client
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: { Email: this.fromEmail },
              To: recipients,
              Subject: subject,
              HTMLPart: htmlBody,
            },
          ],
        });

      console.log({ mailjetResponse: result.body });
      return true;
    } catch (error) {
      console.error('Mailjet error:', error);
      return false;
    }
  }
}
