import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryRawMaterialDto } from './dto/create-inventory-raw-material.dto';
import { UpdateInventoryRawMaterialDto } from './dto/update-inventory-raw-material.dto';
import { inventory_raw_materials } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { RawMaterialsService } from '../raw_materials/raw_materials.service';

@Injectable()
export class InventoryRawMaterialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
    private readonly rawMaterialsService: RawMaterialsService,
  ) {}

  /**
   * Obtener todo el inventario del cliente (estado actual)
   */
  async findAll(clientId: bigint, rawMaterialId?: bigint): Promise<inventory_raw_materials[]> {
    const where: any = { client_id: clientId };
    if (rawMaterialId) {
      where.raw_material_id = rawMaterialId;
    }

    return this.prisma.inventory_raw_materials.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      include: { 
        raw_materials: true,
      },
    });
  }

  /**
   * Obtener un registro específico de inventario
   */
  async findOne(id: bigint, clientId: bigint): Promise<inventory_raw_materials | null> {
    const inventory = await this.prisma.inventory_raw_materials.findUnique({
      where: { id },
      include: { raw_materials: true },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory record with ID ${id} not found`);
    }

    // Validar que pertenece al cliente
    if (inventory.client_id !== clientId) {
      throw new ForbiddenException('Access to this inventory record is denied');
    }

    return inventory;
  }

  /**
   * Buscar inventario por cliente y materia prima
   */
  async findByClientAndRawMaterial(
    clientId: bigint,
    rawMaterialId: bigint,
  ): Promise<inventory_raw_materials | null> {
    return this.prisma.inventory_raw_materials.findFirst({
      where: {
        client_id: clientId,
        raw_material_id: rawMaterialId,
      },
    });
  }

  /**
   * Crear registro de inventario inicial (raramente usado directamente)
   * Normalmente el inventario se crea automáticamente con el primer movimiento
   */
  async create(
    createInventoryDto: CreateInventoryRawMaterialDto,
    clientId: bigint,
  ): Promise<inventory_raw_materials> {
    // Validar que el cliente existe
    await this.clientsService.findOne(clientId);

    // Validar que la materia prima existe y pertenece al cliente
    const rawMaterialId = BigInt(createInventoryDto.raw_material_id);
    await this.rawMaterialsService.findOne(rawMaterialId, clientId);

    // Verificar que no exista ya un registro de inventario para esta combinación
    const existing = await this.findByClientAndRawMaterial(clientId, rawMaterialId);
    if (existing) {
      throw new BadRequestException(
        `Inventory record already exists for this raw material. Use movements to update quantities.`,
      );
    }

    return this.prisma.inventory_raw_materials.create({
      data: {
        client_id: clientId,
        raw_material_id: rawMaterialId,
        quantity: createInventoryDto.quantity,
        unit: createInventoryDto.unit,
      },
    });
  }

  /**
   * Actualizar inventario (usado internamente por el sistema de movimientos)
   */
  async update(
    id: bigint,
    updateInventoryDto: UpdateInventoryRawMaterialDto,
    clientId: bigint,
  ): Promise<inventory_raw_materials> {
    // Verificar existencia y propiedad
    await this.findOne(id, clientId);

    return this.prisma.inventory_raw_materials.update({
      where: { id },
      data: {
        ...updateInventoryDto,
        updated_at: new Date(),
      },
    });
  }

  /**
   * Actualizar o crear inventario (usado por el sistema de movimientos)
   */
  async upsertInventory(
    clientId: bigint,
    rawMaterialId: bigint,
    quantity: number,
    unit: string,
  ): Promise<inventory_raw_materials> {
    const existing = await this.findByClientAndRawMaterial(clientId, rawMaterialId);

    if (existing) {
      return this.prisma.inventory_raw_materials.update({
        where: { id: existing.id },
        data: {
          quantity,
          unit,
          updated_at: new Date(),
        },
      });
    } else {
      return this.prisma.inventory_raw_materials.create({
        data: {
          client_id: clientId,
          raw_material_id: rawMaterialId,
          quantity,
          unit,
        },
      });
    }
  }

  /**
   * Eliminar registro de inventario
   */
  async remove(id: bigint, clientId: bigint): Promise<inventory_raw_materials> {
    // Verificar existencia y propiedad
    await this.findOne(id, clientId);

    return this.prisma.inventory_raw_materials.delete({
      where: { id },
    });
  }
}
