import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UrlObject {
    @ApiProperty({ example: "GitHub" })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: "https://github.com/username" })
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class CreateUserDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "John" })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: "Doe" })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiPropertyOptional({
        type: [UrlObject],
        description: "Optional array of URLs with titles",
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UrlObject)
    urls?: UrlObject[];

    @ApiPropertyOptional({ example: "image/png" })
    @IsOptional()
    @IsString()
    mimeType?: string;
}
