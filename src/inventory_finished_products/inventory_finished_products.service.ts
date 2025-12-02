import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryFinishedProductDto } from './dto/create-inventory-finished-product.dto';
import { UpdateInventoryFinishedProductDto } from './dto/update-inventory-finished-product.dto';
import { inventory_finished_products } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class InventoryFinishedProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Obtener todo el inventario del cliente (estado actual)
   */
  async findAll(clientId: bigint, productId?: bigint): Promise<inventory_finished_products[]> {
    const where: any = { client_id: clientId };
    if (productId) {
      where.product_id = productId;
    }

    return this.prisma.inventory_finished_products.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      include: { 
        products: true,
      },
    });
  }

  /**
   * Obtener un registro específico de inventario
   */
  async findOne(id: bigint, clientId: bigint): Promise<inventory_finished_products | null> {
    const inventory = await this.prisma.inventory_finished_products.findUnique({
      where: { id },
      include: { products: true },
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
   * Buscar inventario por cliente y producto
   */
  async findByClientAndProduct(
    clientId: bigint,
    productId: bigint,
  ): Promise<inventory_finished_products | null> {
    return this.prisma.inventory_finished_products.findFirst({
      where: {
        client_id: clientId,
        product_id: productId,
      },
    });
  }

  /**
   * Crear registro de inventario inicial (raramente usado directamente)
   * Normalmente el inventario se crea automáticamente con el primer movimiento
   */
  async create(
    createInventoryDto: CreateInventoryFinishedProductDto,
    clientId: bigint,
  ): Promise<inventory_finished_products> {
    // Validar que el cliente existe
    await this.clientsService.findOne(clientId);

    // Validar que el producto existe y pertenece al cliente
    const productId = BigInt(createInventoryDto.product_id);
    await this.productsService.findOne(productId, clientId);

    // Verificar que no exista ya un registro de inventario para esta combinación
    const existing = await this.findByClientAndProduct(clientId, productId);
    if (existing) {
      throw new BadRequestException(
        `Inventory record already exists for this product. Use movements to update quantities.`,
      );
    }

    return this.prisma.inventory_finished_products.create({
      data: {
        client_id: clientId,
        product_id: productId,
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
    updateInventoryDto: UpdateInventoryFinishedProductDto,
    clientId: bigint,
  ): Promise<inventory_finished_products> {
    // Verificar existencia y propiedad
    await this.findOne(id, clientId);

    return this.prisma.inventory_finished_products.update({
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
    productId: bigint,
    quantity: number,
    unit: string,
  ): Promise<inventory_finished_products> {
    const existing = await this.findByClientAndProduct(clientId, productId);

    if (existing) {
      return this.prisma.inventory_finished_products.update({
        where: { id: existing.id },
        data: {
          quantity,
          unit,
          updated_at: new Date(),
        },
      });
    } else {
      return this.prisma.inventory_finished_products.create({
        data: {
          client_id: clientId,
          product_id: productId,
          quantity,
          unit,
        },
      });
    }
  }

  /**
   * Eliminar registro de inventario
   */
  async remove(id: bigint, clientId: bigint): Promise<inventory_finished_products> {
    // Verificar existencia y propiedad
    await this.findOne(id, clientId);

    return this.prisma.inventory_finished_products.delete({
      where: { id },
    });
  }
}
