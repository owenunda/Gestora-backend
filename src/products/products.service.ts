import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { products } from '@prisma/client';
import { ProductsCategoriesService } from '../products_categories/products_categories.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsCategoriesService: ProductsCategoriesService,
    private readonly uploadService: UploadService,
  ) {}

  async create(createProductDto: CreateProductDto, clientId: bigint): Promise<products> {
    let categoryId: bigint | null = null;
    if (createProductDto.category_id) {
      categoryId = BigInt(createProductDto.category_id);
      await this.productsCategoriesService.findOne(categoryId, clientId);
    }

    const { category_id, ...rest } = createProductDto;

    return this.prisma.products.create({
      data: {
        ...rest,
        client_id: clientId,
        category_id: categoryId,
      },
    });
  }

  async findAll(clientId: bigint): Promise<products[]> {
    return this.prisma.products.findMany({
      where: {
        client_id: clientId,
      },
      include: {
        products_categories: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint, clientId: bigint): Promise<products> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        products_categories: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.client_id !== clientId) {
      throw new ForbiddenException('Access to this product is denied');
    }

    return product;
  }

  async update(id: bigint, updateProductDto: UpdateProductDto, clientId: bigint): Promise<products> {
    const existingProduct = await this.findOne(id, clientId);

    const { category_id, ...rest } = updateProductDto;
    const data: any = { ...rest };

    if ('category_id' in updateProductDto) {
      if (category_id) {
        const newCategoryId = BigInt(category_id);
        await this.productsCategoriesService.findOne(newCategoryId, clientId);
        data.category_id = newCategoryId;
      } else {
        data.category_id = null;
      }
    }

    // Si se está actualizando la imagen, eliminar la anterior
    if (updateProductDto.image_url && existingProduct.image_url) {
      await this.uploadService.deleteProductImage(existingProduct.image_url);
    }

    try {
      return await this.prisma.products.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: bigint, clientId: bigint): Promise<products> {
    const product = await this.findOne(id, clientId);

    // Eliminar imagen de R2 si existe
    if (product.image_url) {
      await this.uploadService.deleteProductImage(product.image_url);
    }

    try {
      return await this.prisma.products.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new Error('Cannot delete product because it has related records.');
      }
      throw error;
    }
  }
}
