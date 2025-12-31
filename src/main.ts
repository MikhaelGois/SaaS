import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Assuming @nestjs/common is installed
import { AuditInterceptor } from './audit/audit.interceptor'; // Assuming AuditInterceptor is available
import { AuditService } from './audit/audit.service'; // Assuming AuditService is available

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically remove properties that are not defined in the DTO
    transform: true, // Automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    transformOptions: {
      enableImplicitConversion: true, // Allows automatic type conversion based on DTO types
    },
  }));

  // Apply global audit interceptor
  // Note: AuditService needs to be resolved from the app context
  const auditService = app.get(AuditService);
  app.useGlobalInterceptors(new AuditInterceptor(auditService));


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
