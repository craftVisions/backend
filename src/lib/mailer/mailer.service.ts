import { Injectable } from "@nestjs/common";
import { LocalMailProvider } from "./providers/local.provider";
import { EmailSendOptions } from "./interface";
import { ResendMailProvider } from "./providers/resend.provider";

@Injectable()
export class Mailer {
    private mailer: LocalMailProvider | ResendMailProvider;
    public sendMail: (options: EmailSendOptions) => Promise<any>;
    constructor() {
        if (process.env.MAIL_SERVICE_PROVIDER === "LOCAL") {
            this.mailer = new LocalMailProvider({
                host: process.env.MAIL_HOST,
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            });
        }

        if (process.env.MAIL_SERVICE_PROVIDER === "RESEND") {
            this.mailer = new ResendMailProvider();
        }

        this.sendMail = this.mailer.sendMail.bind(this.mailer);
    }
}
