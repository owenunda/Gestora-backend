import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { suppliers } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<suppliers> {
    return this.prisma.suppliers.create({
      data: {
        ...createSupplierDto,
        client_id: BigInt(createSupplierDto.client_id),
      },
    });
  }

  async findAll(): Promise<suppliers[]> {
    return this.prisma.suppliers.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint): Promise<suppliers | null> {
    const supplier = await this.prisma.suppliers.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: bigint, updateSupplierDto: UpdateSupplierDto): Promise<suppliers> {
    const { client_id, ...rest } = updateSupplierDto;
    const data: any = { ...rest };
    
    if (client_id) {
      data.client_id = BigInt(client_id);
    }

    try {
      return await this.prisma.suppliers.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: bigint): Promise<suppliers> {
    try {
      return await this.prisma.suppliers.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }
      // P2003 is foreign key constraint violation
      if (error.code === 'P2003') {
        throw new Error('Cannot delete supplier because it has related records.');
      }
      throw error;
    }
  }
}
