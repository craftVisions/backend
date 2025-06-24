import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse();

        console.log(`\nRequest: ${req.method} ${req.url}`);
        if (req.headers.hasOwnProperty("authorization")) {
            console.log("Auth:", req.headers["authorization"]);
        }
        if (req.body && Object.keys(req.body).length > 0) {
            console.log("Body:", JSON.stringify(req.body));
        }

        const originalJson = res.json.bind(res);
        res.json = (body: any): any => {
            try {
                console.log("Response:", body ? JSON.stringify(body) : "null or undefined", "\n");
            } catch (err) {
                console.log("Response: [Unable to stringify response]", "\n");
            }
            return originalJson(body);
        };

        return next.handle();
    }
}
