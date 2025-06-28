import { Resend } from "resend";
import { EmailSendOptions } from "../interface";

export class ResendMailProvider {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendMail(options: EmailSendOptions) {
        const from = options.from ?? process.env.MAIL_USER! ?? "community.craftvisions@gmail.com";
        return await this.resend.emails.send({ ...options, from });
    }
}
