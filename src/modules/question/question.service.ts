import { Injectable, HttpStatus } from "@nestjs/common";
import { DrizzleService } from "src/db/drizzle.service";
import { HandleDbErrors } from "src/lib/decorators/handle-db-errors";
import { CustomException } from "src/lib/exception/custom-exception";
import { eq } from "drizzle-orm";
import { CreateQuestionDto, UpdateQuestionDto } from "./interfaces/question.interface";
import { questions } from "src/db/schema";

const DB_ERRORS = {
    // Add your unique constraints or error keys here if needed
};

@Injectable()
export class QuestionService {
    constructor(private readonly drizzleService: DrizzleService) {}

    @HandleDbErrors(DB_ERRORS)
    // async createQuestion(input: CreateQuestionDto) {
    //     const [question] = await this.drizzleService.db.insert(questions).values(input).returning();

    //     return question;
    // }

    // @HandleDbErrors(DB_ERRORS)
    // async updateQuestion(id: string, input: UpdateQuestionDto) {
    //     const [question] = await this.drizzleService.db
    //         .update(questions)
    //         .set({ ...input, updatedAt: new Date() })
    //         .where(eq(questions.id, id))
    //         .returning();

    //     if (!question) {
    //         throw new CustomException("Question not found", HttpStatus.NOT_FOUND);
    //     }

    //     return question;
    // }

    async getQuestionById(id: string) {
        const [question] = await this.drizzleService.db.select().from(questions).where(eq(questions.id, id)).limit(1);

        if (!question) {
            throw new CustomException("Question not found", HttpStatus.NOT_FOUND);
        }

        return question;
    }

    async getAllQuestions() {
        return await this.drizzleService.db.select().from(questions);
    }

    async deleteQuestion(id: string) {
        const result = await this.drizzleService.db.delete(questions).where(eq(questions.id, id));

        if (result.rowCount === 0) {
            throw new CustomException("Question not found", HttpStatus.NOT_FOUND);
        }

        return {
            message: "Question deleted successfully",
        };
    }
}
