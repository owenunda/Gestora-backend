import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryFinishedProductMovementDto } from './dto/create-inventory-finished-product-movement.dto';
import { inventory_finished_product_movements } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { ProductsService } from '../products/products.service';
import { InventoryFinishedProductsService } from '../inventory_finished_products/inventory_finished_products.service';

@Injectable()
export class InventoryFinishedProductMovementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
    private readonly productsService: ProductsService,
    private readonly inventoryService: InventoryFinishedProductsService,
  ) {}

  /**
   * Registrar un movimiento de inventario
   * Esta es la función principal que implementa la lógica de negocio:
   * 1. Valida el cliente y el producto
   * 2. Crea el registro del movimiento
   * 3. Actualiza el inventario actual
   * 4. Valida que el inventario no quede negativo
   */
  async createMovement(
    createMovementDto: CreateInventoryFinishedProductMovementDto,
    clientId: bigint,
  ): Promise<inventory_finished_product_movements> {
    // 1. Validar que el cliente existe
    await this.clientsService.findOne(clientId);

    // 2. Validar que el producto existe y pertenece al cliente
    const productId = BigInt(createMovementDto.product_id);
    await this.productsService.findOne(productId, clientId);

    // 3. Determinar si es entrada o salida según el tipo de movimiento
    const isEntry = this.isEntryMovement(createMovementDto.type);
    const quantity = createMovementDto.quantity;

    // Validar que la cantidad sea positiva (excepto para ajustes)
    if (createMovementDto.type !== 'adjustment' && quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    if (quantity === 0) {
      throw new BadRequestException('Quantity cannot be 0');
    }

    // 4. Calcular el delta (cambio en inventario)
    const delta = isEntry ? quantity : -quantity;

    // 5. Obtener inventario actual
    const currentInventory = await this.inventoryService.findByClientAndProduct(
      clientId,
      productId,
    );

    const currentQty = currentInventory ? Number(currentInventory.quantity) : 0;
    const newQty = currentQty + delta;

    // 6. Validar que el inventario no quede negativo
    if (newQty < 0) {
      throw new BadRequestException(
        `Insufficient inventory. Current: ${currentQty} ${createMovementDto.unit}, Requested: ${quantity} ${createMovementDto.unit}`,
      );
    }

    // 7. Crear el registro del movimiento
    const movement = await this.prisma.inventory_finished_product_movements.create({
      data: {
        client_id: clientId,
        product_id: productId,
        type: createMovementDto.type,
        quantity: delta, // Guardar con signo (+ para entrada, - para salida)
        unit: createMovementDto.unit,
        reference_id: createMovementDto.reference_id,
        notes: createMovementDto.notes,
      },
    });

    // 8. Actualizar el inventario actual
    await this.inventoryService.upsertInventory(
      clientId,
      productId,
      newQty,
      createMovementDto.unit,
    );

    return movement;
  }

  /**
   * Obtener todos los movimientos del cliente
   */
  async findAll(
    clientId: bigint,
    filters?: {
      productId?: bigint;
      type?: string;
    },
  ): Promise<inventory_finished_product_movements[]> {
    const where: any = { client_id: clientId };

    if (filters?.productId) {
      where.product_id = filters.productId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    return this.prisma.inventory_finished_product_movements.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        products: true,
      },
    });
  }

  /**
   * Obtener un movimiento específico
   */
  async findOne(id: string, clientId: bigint): Promise<inventory_finished_product_movements | null> {
    const movement = await this.prisma.inventory_finished_product_movements.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }

    // Validar que pertenece al cliente
    if (movement.client_id !== clientId) {
      throw new BadRequestException('Access to this movement is denied');
    }

    return movement;
  }

  /**
   * Determinar si un tipo de movimiento es entrada o salida
   * Entradas: production_output, initial_load
   * Salidas: sale
   * Ambos: adjustment (según el signo)
   */
  private isEntryMovement(type: string): boolean {
    const entryTypes = ['production_output', 'initial_load'];
    const exitTypes = ['sale'];

    if (entryTypes.includes(type)) {
      return true;
    }

    if (exitTypes.includes(type)) {
      return false;
    }

    // Para 'adjustment', depende del signo de la cantidad
    // pero lo manejamos en el controller/frontend
    // Por ahora, asumimos que adjustment puede ser entrada o salida
    // según el contexto (se maneja con cantidad positiva/negativa)
    if (type === 'adjustment') {
      // El frontend debe enviar quantity positiva para entrada
      // y el backend la trata como entrada por defecto
      // Si quieren salida, deben usar tipo diferente o lógica adicional
      return true; // Por defecto, ajustes son entradas
    }

    throw new BadRequestException(`Invalid movement type: ${type}`);
  }

  /**
   * Registrar salida de producción (llamado desde el módulo de producción)
   * Este método es usado internamente por el sistema cuando se crea una producción
   */
  async registerProductionOutput(
    clientId: bigint,
    productId: bigint,
    quantity: number,
    unit: string,
    productionId: string,
    notes?: string,
  ): Promise<inventory_finished_product_movements> {
    return this.createMovement(
      {
        product_id: Number(productId),
        type: 'production_output',
        quantity,
        unit,
        reference_id: productionId,
        notes: notes || `Salida de producción ${productionId}`,
      },
      clientId,
    );
  }
}
