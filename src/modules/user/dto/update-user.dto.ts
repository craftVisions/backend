import { IsEmail, IsOptional, IsString, ValidateNested, IsArray, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UrlObject } from "./create-user.dto";

export class UpdateUserDto {
    @ApiPropertyOptional({ example: "user@newemail.com" })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: "Jane" })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @ApiPropertyOptional({ example: "Smith" })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @ApiPropertyOptional({
        type: [UrlObject],
        description: "Array of updated URLs (title + url)",
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UrlObject)
    urls?: UrlObject[];

    @ApiPropertyOptional({ example: "image/jpeg" })
    @IsOptional()
    @IsString()
    mimeType?: string;
}
