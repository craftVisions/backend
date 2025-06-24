import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { ResponseData } from "src/lib/transformer/response";
import { CustomException } from "src/lib/exception/custom-exception";

@Injectable()
export class AuthService {
    create(createAuthDto: CreateAuthDto) {
        return ResponseData({
            message: "hello",
            data: "hello",
        });
    }

    findAll() {
        let num = 11;
        if (num > 10) {
            throw new CustomException("hello", HttpStatus.BAD_REQUEST);
        }
        return ResponseData({
            message: "hello",
            data: "hello",
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    update(id: number, updateAuthDto: UpdateAuthDto) {
        return `This action updates a #${id} auth`;
    }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}
