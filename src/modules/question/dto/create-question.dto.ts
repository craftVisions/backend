import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsArray, IsIn, IsObject } from "class-validator";

export class CreateQuestionDto {
    @ApiProperty({ example: "Two Sum", description: "Title of the question" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: "Given an array of integers nums and an integer target, return indices...", description: "Detailed description of the question" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: "easy", enum: ["easy", "medium", "hard"], description: "Difficulty level of the question" })
    @IsNotEmpty()
    @IsString()
    @IsIn(["easy", "medium", "hard"])
    difficulty: "easy" | "medium" | "hard";

    @ApiPropertyOptional({ example: ["arrays", "hashmap"], description: "Tags associated with the question" })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ example: { hint1: "Try using a hashmap" }, description: "Hints to help solve the question" })
    @IsOptional()
    @IsObject()
    hints?: Record<string, any>;
}
