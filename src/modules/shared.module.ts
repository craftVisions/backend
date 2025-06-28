import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { DatabaseModule } from "src/db/database.module";
import { Mailer } from "src/lib/mailer/mailer.service";
import { QuestionModule } from './question/question.module';
import { SubmissionModule } from './submission/submission.module';

@Global()
@Module({
    imports: [DatabaseModule, PassportModule, QuestionModule, SubmissionModule],
    providers: [JwtService, Mailer],
    exports: [DatabaseModule, PassportModule, Mailer, JwtService],
})
export class SharedModule {}
