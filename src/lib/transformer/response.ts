import { HttpStatus } from "@nestjs/common";

export type ResponseDto<T> = {
    data: T;
    status: HttpStatus;
};

export const ResponseData = <T>(data: T): ResponseDto<T> => {
    return {
        status: HttpStatus.OK,
        data,
    };
};