import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(page = 1, limit = 10, search = '') {
    const [data, total] = await this.repo.findAndCount({
      where: search ? [
        { name: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ] : {},
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'role', 'avatarUrl', 'createdAt'],
    });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'avatarUrl', 'createdAt'],
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async create(data: Partial<User>) {
    const exists = await this.repo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email já cadastrado');
    const hash = await bcrypt.hash(data.password as string, 10);    
    const user = this.repo.create({ ...data, password: hash });
    return this.repo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findOne(id);
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { message: 'Usuário removido com sucesso' };
  }

  async updateAvatar(id: string, avatarUrl: string) {
    await this.repo.update(id, { avatarUrl });
    return this.findOne(id);
  }
}