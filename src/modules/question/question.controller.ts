import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/constants/roles.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/interfaces/user";
import { IsAuthorizedAccess, UserContext } from "src/lib/decorators";
import { IdOnlyDto, ResponseData } from "src/lib/transformer/response";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionService } from "./question.service";

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
}
