import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggingInterceptor } from "./lib/interceptors/logger.interceptor";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./lib/exception/global-exception";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    if (process.env.STAGE === "dev") {
        const config = new DocumentBuilder().setTitle("Craft Vision").setDescription("Craft Vision Api Documentation").setVersion("1.0").addTag("Craft Vision").build();
        const documentFactory = () =>
            SwaggerModule.createDocument(app, config, {
                autoTagControllers: true,
            });
        SwaggerModule.setup("api", app, documentFactory);
    }

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
