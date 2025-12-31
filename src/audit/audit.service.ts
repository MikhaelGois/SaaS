import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express'; // Assuming express is used

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async logAction(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    details: Record<string, any>,
    req?: Request,
  ) {
    const logEntry = {
      timestamp: new Date(),
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent'],
    };
    this.logger.log(`AUDIT: ${JSON.stringify(logEntry)}`);

    // In a real application, you would persist this to a database
    // await this.prisma.auditLog.create({ data: logEntry });
  }
}
