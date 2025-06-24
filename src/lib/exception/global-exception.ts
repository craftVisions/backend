import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";
        let errors: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();

            if (typeof response === "object" && response !== null) {
                const { message: msg, error, errors: errs } = response as any;

                // ValidationPipe error case: message is an array of strings
                if (Array.isArray(msg)) {
                    errors = msg;
                    message = "Validation failed";
                } else {
                    message = msg || error || message;
                    errors = errs || null;
                }
            } else {
                message = response as string;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        console.error("Exception:", exception);

        res.status(status).json({
            statusCode: status,
            response: {
                status: "error",
                error: {
                    message,
                    ...(errors ? { errors } : {}),
                },
            },
        });
    }
}
