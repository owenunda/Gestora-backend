import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { raw_materials } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { SuppliersService } from '../suppliers/suppliers.service';

@Injectable()
export class RawMaterialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
    private readonly suppliersService: SuppliersService,
  ) {}

  async create(createRawMaterialDto: CreateRawMaterialDto): Promise<raw_materials> {
    const clientId = BigInt(createRawMaterialDto.client_id);
    
    // Validar que el cliente exista
    await this.clientsService.findOne(clientId);

    // Si se proporciona supplier_id, validar que el proveedor exista
    let supplierId: bigint | null = null;
    if (createRawMaterialDto.supplier_id) {
      supplierId = BigInt(createRawMaterialDto.supplier_id);
      await this.suppliersService.findOne(supplierId);
    }

    const { client_id, supplier_id, ...rest } = createRawMaterialDto;

    return this.prisma.raw_materials.create({
      data: {
        ...rest,
        client_id: clientId,
        supplier_id: supplierId,
      },
    });
  }

  async findAll(): Promise<raw_materials[]> {
    return this.prisma.raw_materials.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint): Promise<raw_materials | null> {
    const rawMaterial = await this.prisma.raw_materials.findUnique({
      where: { id },
    });

    if (!rawMaterial) {
      throw new NotFoundException(`Raw material with ID ${id} not found`);
    }

    return rawMaterial;
  }

  async update(id: bigint, updateRawMaterialDto: UpdateRawMaterialDto): Promise<raw_materials> {
    const { client_id, supplier_id, ...rest } = updateRawMaterialDto;
    const data: any = { ...rest };
    
    if (client_id) {
      data.client_id = BigInt(client_id);
    }

    if (supplier_id) {
      data.supplier_id = BigInt(supplier_id);
    }

    try {
      return await this.prisma.raw_materials.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Raw material with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: bigint): Promise<raw_materials> {
    try {
      return await this.prisma.raw_materials.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Raw material with ID ${id} not found`);
      }
      // P2003 is foreign key constraint violation
      if (error.code === 'P2003') {
        throw new Error('Cannot delete raw material because it has related records.');
      }
      throw error;
    }
  }
}

