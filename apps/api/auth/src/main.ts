import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter, HttpExceptionFilter } from '@able/api-shared';
import { I18nValidationPipe } from 'nestjs-i18n';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
    app.enableCors({ origin: '*' });

    const config = new DocumentBuilder()
        .setTitle('Able API')
        .setDescription('API for Able Application')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Able API Documentation',
    });

    app.useGlobalPipes(
        new I18nValidationPipe({
            transform: true,
        }),
        new ValidationPipe({
            transform: true,
        })
    );

    await app.listen(3000);
    Logger.verbose(`[::API::] HTTP running on 3000 ✅`);

}

bootstrap();
