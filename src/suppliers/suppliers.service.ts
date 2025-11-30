import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { suppliers } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
  ) {}

  async create(createSupplierDto: CreateSupplierDto, clientId: bigint): Promise<suppliers> {
    // Validar que el cliente exista (aunque viene del token, es buena práctica o si se usa internamente)
    await this.clientsService.findOne(clientId);

    return this.prisma.suppliers.create({
      data: {
        ...createSupplierDto,
        client_id: clientId,
      },
    });
  }

  async findAll(clientId: bigint): Promise<suppliers[]> {
    return this.prisma.suppliers.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint, clientId: bigint): Promise<suppliers | null> {
    const supplier = await this.prisma.suppliers.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    if (supplier.client_id !== clientId) {
      throw new ForbiddenException('Access to this supplier is denied');
    }

    return supplier;
  }

  async update(id: bigint, updateSupplierDto: UpdateSupplierDto, clientId: bigint): Promise<suppliers> {
    // Verificar existencia y propiedad antes de actualizar
    await this.findOne(id, clientId);
    
    // No permitimos cambiar el client_id
    
    try {
      return await this.prisma.suppliers.update({
        where: { id },
        data: updateSupplierDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: bigint, clientId: bigint): Promise<suppliers> {
    // Verificar existencia y propiedad antes de eliminar
    await this.findOne(id, clientId);

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
