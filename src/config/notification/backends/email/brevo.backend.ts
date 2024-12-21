import * as Brevo from "@getbrevo/brevo";
import { Logger } from "winston";
import { AppConfig } from "../../../app.config";
import { LoggerConfig } from "../../../logger/logger.config";

export class BrevoMailer {
  readonly logger: Logger;
  readonly apiKey: string;

  constructor(apiKey: string) {
    this.logger = LoggerConfig.get().logger;
    this.apiKey = apiKey;
  }

  private getInstance(): Brevo.TransactionalEmailsApi {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(0, this.apiKey);
    return apiInstance;
  }

  public async sendEmail(
    recipient: string,
    subject: string,
    template: string,
    params: object
  ) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: AppConfig.notification.email.fromName,
      email: AppConfig.notification.email.fromEmail,
    };
    sendSmtpEmail.to = [{ email: recipient }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = template;
    sendSmtpEmail.params = params;

    const apiInstance = this.getInstance();
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      (data) => {
        this.logger.info(
          `API called successfully. status: ${data.response.statusCode} and body: ${data}`
        );
      },
      (error) => {
        this.logger.error(
          `Error calling Brevo API: ${error} ${JSON.stringify(apiInstance)}}`
        );
      }
    );
  }
}
