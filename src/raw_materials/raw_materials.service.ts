import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async create(createRawMaterialDto: CreateRawMaterialDto, clientId: bigint): Promise<raw_materials> {
    // Validar que el cliente exista
    await this.clientsService.findOne(clientId);

    // Si se proporciona supplier_id, validar que el proveedor exista y pertenezca al cliente
    let supplierId: bigint | null = null;
    if (createRawMaterialDto.supplier_id) {
      supplierId = BigInt(createRawMaterialDto.supplier_id);
      await this.suppliersService.findOne(supplierId, clientId); // Esto ya valida que pertenezca al cliente
    }

    // Separar supplier_id del resto de los campos
    const { supplier_id, ...rest } = createRawMaterialDto;

    return this.prisma.raw_materials.create({
      data: {
        ...rest,
        client_id: clientId,
        supplier_id: supplierId,
      },
    });
  }

  async findAll(clientId: bigint): Promise<raw_materials[]> {
    return this.prisma.raw_materials.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint, clientId: bigint): Promise<raw_materials | null> {
    const rawMaterial = await this.prisma.raw_materials.findUnique({
      where: { id },
    });

    if (!rawMaterial) {
      throw new NotFoundException(`Raw material with ID ${id} not found`);
    }

    if (rawMaterial.client_id !== clientId) {
      throw new ForbiddenException('Access to this raw material is denied');
    }

    return rawMaterial;
  }

  async update(id: bigint, updateRawMaterialDto: UpdateRawMaterialDto, clientId: bigint): Promise<raw_materials> {
    // Verificar existencia y propiedad antes de actualizar
    await this.findOne(id, clientId);

    // Separar supplier_id del resto de los campos
    const { supplier_id, ...rest } = updateRawMaterialDto;
    const data: any = { ...rest };
    
    // Verificar si supplier_id está presente en el DTO (incluso si es null)
    if ('supplier_id' in updateRawMaterialDto) {
      if (supplier_id) {
        // Si hay un valor, validar que el proveedor exista y pertenezca al cliente
        const newSupplierId = BigInt(supplier_id);
        await this.suppliersService.findOne(newSupplierId, clientId);
        data.supplier_id = newSupplierId;
      } else {
        // Si es null o undefined, permitir establecerlo a null
        data.supplier_id = null;
      }
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

  async remove(id: bigint, clientId: bigint): Promise<raw_materials> {
    // Verificar existencia y propiedad antes de eliminar
    await this.findOne(id, clientId);

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

