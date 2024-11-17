import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomResponseInterceptor } from './common/globalInterceptor';
import { GlobalExceptionFilter } from './common/globalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'debug'],
  });
  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Short Link Service')
    .setDescription('API documentation for the Short Link Service')
    .setVersion('1.0')
    .addTag('Links')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new CustomResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  let port = process.env.PORT_DEV || 8000;
  await app.listen(port, () => {
    console.log('---------------------------------------');
    console.log(`Application is running on port ${port}`);
    console.log('---------------------------------------');
  });
}
bootstrap();
