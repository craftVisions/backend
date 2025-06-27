import { isValidationOptions } from "class-validator";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailSendOptions } from "../interface";

export class LocalMailProvider {
    private transport: Transporter<SMTPTransport.SentMessageInfo>;
    private options: SMTPTransport.Options;
    constructor(options: SMTPTransport.Options) {
        this.options = options;
        this.transport = createTransport(options);
    }

    async sendMail(options: EmailSendOptions) {
        options.from = options.from || process.env.MAIL_USER || 'community.craftvisions@gmail.com';
        return await this.transport.sendMail(options);
    }
}
