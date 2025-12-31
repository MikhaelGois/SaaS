import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user']; // Assuming user is attached by JwtAuthGuard

    const { method, url, body } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        // Log successful requests
        this.auditService.logAction(
          user?.userId || 'anonymous',
          `HTTP ${method} ${url}`,
          'Request',
          '', // No specific entity ID for a general request log
          {
            body: body,
            responseStatus: context.switchToHttp().getResponse().statusCode,
            duration: `${Date.now() - now}ms`,
          },
          request,
        );
      }),
    );
  }
}
