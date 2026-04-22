import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}

  async log(userId: string, action: string, entity: string, entityId: string, details?: object) {
    const entry = this.repo.create({
      user: { id: userId } as any,
      action,
      entity,
      entityId,
      details,
    });
    return this.repo.save(entry);
  }

  async findAll(page = 1, limit = 20, userId?: string, startDate?: string, endDate?: string) {
    const where: any = {};
    if (userId) where.user = { id: userId };
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }
}