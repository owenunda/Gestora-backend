import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';
import { products_categories } from '@prisma/client';

@Injectable()
export class ProductsCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductsCategoryDto: CreateProductsCategoryDto, clientId: bigint): Promise<products_categories> {
    return this.prisma.products_categories.create({
      data: {
        ...createProductsCategoryDto,
        client_id: clientId,
      },
    });
  }

  async findAll(clientId: bigint): Promise<products_categories[]> {
    return this.prisma.products_categories.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint, clientId: bigint): Promise<products_categories | null> {
    const category = await this.prisma.products_categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.client_id !== clientId) {
      throw new ForbiddenException('Access to this category is denied');
    }

    return category;
  }

  async update(id: bigint, updateProductsCategoryDto: UpdateProductsCategoryDto, clientId: bigint): Promise<products_categories> {
    await this.findOne(id, clientId);

    try {
      return await this.prisma.products_categories.update({
        where: { id },
        data: updateProductsCategoryDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: bigint, clientId: bigint): Promise<products_categories> {
    await this.findOne(id, clientId);

    try {
      return await this.prisma.products_categories.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new Error('Cannot delete category because it has related products.');
      }
      throw error;
    }
  }
}
