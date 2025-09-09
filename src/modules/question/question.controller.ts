import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/constants/roles.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/interfaces/user";
import { IsAuthorizedAccess, UserContext } from "src/lib/decorators";
import { IdOnlyDto, ResponseData } from "src/lib/transformer/response";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionService } from "./question.service";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Controller("question")
@UseGuards(AuthGuard)
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @IsAuthorizedAccess([Roles.ADMIN])
    async createQuestion(@Body() dto: CreateQuestionDto, @UserContext() { userId }: User): Promise<IdOnlyDto> {
        const id = await this.questionService.createQuestion({
            createdBy: userId,
            title: dto.title,
            description: dto.description,
            difficulty: dto.difficulty,
            tags: dto?.tags,
            hints: dto?.hints,
        });
        return ResponseData({ id });
    }

    @Get()
    async getQuestions() {
        const questions = await this.questionService.getAllQuestions();
        return ResponseData({ questions });
    }

    @Get(":questionId")
    async getQuestionById(@Param("questionId") questionId: string) {
        const question = await this.questionService.getQuestionById(questionId);
        return ResponseData({ question });
    }

    @Patch(":questionId")
    async updateQuestionById(@Param("questionId") questionId: string, @Body() dto: UpdateQuestionDto, @UserContext() { userId }) {
        const id = await this.questionService.updateQuestion(questionId, {
            updatedBy: userId,
            title: dto?.title,
            description: dto?.description,
            difficulty: dto?.difficulty,
            tags: dto?.tags,
            hints: dto?.hints,
        });

        return ResponseData({ id });
    }

    @Delete(":questionId")
    async deleteQuestionById(@Param("questionId") questionId: string) {
        const id = await this.questionService.deleteQuestion(questionId);
        return ResponseData({ id });
    }
}
