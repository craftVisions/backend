import { HttpException } from '@nestjs/common';

export function HandleDbErrors(errorMap: Record<string, HttpException>): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        const cause = error?.cause ?? error;

        const isDbError = typeof cause?.code === 'string' && !!cause?.message;

        if (!isDbError) {
          throw error;
        }

        // Extract constraint name from either cause.constraint or message
        const constraint =
          cause?.constraint ||
          (cause?.message?.match(/"([^"]+?)"/)?.[1] ?? null);

        if (constraint && errorMap[constraint]) {
          throw errorMap[constraint];
        }

        throw error;
      }
    };

    return descriptor;
  };
}
