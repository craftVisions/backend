import { HttpException, InternalServerErrorException } from "@nestjs/common";

export function HandleDbErrors(errorMap: Record<string, HttpException>): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error: any) {
                const cause = error?.cause ?? error;
                let constraint = cause?.constraint;

                // 🧪 Logging
                console.log("🔥 Decorator caught DB error");

                if (!constraint && cause?.message) {
                    const match = cause.message.match(/"([^"]+)"/);
                    if (match && match[1]) {
                        constraint = match[1];
                    }
                }

                console.log("Extracted constraint:", constraint);

                if (constraint && errorMap[constraint]) {
                    throw errorMap[constraint];
                }

                throw new InternalServerErrorException(cause?.detail || cause?.message || "Unexpected DB error.");
            }
        };

        return descriptor;
    };
}
