import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { EnvConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  const allowedOrigins = EnvConfig.frontendUrls.split(',').map(url => url.trim());
  
  console.log('Allowed CORS Origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  // Interceptores globales
  app.useGlobalInterceptors(new BigIntInterceptor());
  
  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Gestora API')
    .setDescription('API para el sistema de gestión de producción')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Configurar Swagger UI
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(EnvConfig.port ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${EnvConfig.port ?? 3000}`);
  console.log(`📚 API Documentation: http://localhost:${EnvConfig.port ?? 3000}/api/docs`);
}
bootstrap();
