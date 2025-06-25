import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "user@example.com" })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: "John" })
    @IsString()
    firstName: string;

    @ApiPropertyOptional({ example: "Doe" })
    @IsString()
    @IsOptional()
    lastName: string;
}
