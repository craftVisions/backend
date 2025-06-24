import { HttpException, HttpStatus } from "@nestjs/common";

type Exception = {
    message: string;
    status: HttpStatus;
};

export class CustomException extends HttpException {
    constructor(exception: Exception) {
        super(exception.message, exception.status);
    }
}
