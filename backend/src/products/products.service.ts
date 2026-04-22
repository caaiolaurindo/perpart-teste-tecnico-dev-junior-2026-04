import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async findAll(page = 1, limit = 10, search = '', categoryId?: string) {
    const query = this.repo.createQueryBuilder('product')
      .leftJoinAndSelect('product.owner', 'owner')
      .leftJoinAndSelect('product.categories', 'category')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['owner', 'categories'],
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async create(data: any, ownerId: string) {
    const product = this.repo.create({
      ...data,
      owner: { id: ownerId } as any,
      categories: data.categoryIds?.map((id: string) => ({ id })) ?? [],
    });
    return this.repo.save(product);
  }

  async update(id: string, data: any) {
    const product = await this.findOne(id);
    if (data.categoryIds) {
      product.categories = data.categoryIds.map((cid: string) => ({ id: cid } as any));
    }
    Object.assign(product, data);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
    return { message: 'Produto removido com sucesso' };
  }

  async updateImage(id: string, imageUrl: string) {
    await this.repo.update(id, { imageUrl });
    return this.findOne(id);
  }
}