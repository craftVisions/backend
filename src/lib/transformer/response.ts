import { HttpStatus } from "@nestjs/common";

export type ResponseDto<T> = {
    statusCode: number;
    response: {
        status: "ok";
        data: T;
    };
};

export const ResponseData = <T>(data: T): ResponseDto<T> => {
    return {
        statusCode: HttpStatus.OK,
        response: {
            status: "ok",
            data,
        },
    };
};

export type IdOnlyDto = ResponseDto<{
    id: string;
}>;

export type ErrorResponseDto = {
    statusCode: number;
    response: {
        status: "error";
        error: {
            message: string;
            errors?: any;
        };
    };
};

export const ResponseError = (statusCode: HttpStatus, message: string, errors?: any): ErrorResponseDto => {
    return {
        statusCode,
        response: {
            status: "error",
            error: {
                message,
                ...(errors ? { errors } : {}),
            },
        },
    };
};
