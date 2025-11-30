import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryRawMaterialMovementDto } from './dto/create-inventory-raw-material-movement.dto';
import { inventory_raw_material_movements } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { RawMaterialsService } from '../raw_materials/raw_materials.service';
import { InventoryRawMaterialsService } from '../inventory_raw_materials/inventory_raw_materials.service';

@Injectable()
export class InventoryRawMaterialMovementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientsService: ClientsService,
    private readonly rawMaterialsService: RawMaterialsService,
    private readonly inventoryService: InventoryRawMaterialsService,
  ) {}

  /**
   * Registrar un movimiento de inventario
   * Esta es la función principal que implementa la lógica de negocio:
   * 1. Valida el cliente y la materia prima
   * 2. Crea el registro del movimiento
   * 3. Actualiza el inventario actual
   * 4. Valida que el inventario no quede negativo
   */
  async createMovement(
    createMovementDto: CreateInventoryRawMaterialMovementDto,
    clientId: bigint,
  ): Promise<inventory_raw_material_movements> {
    // 1. Validar que el cliente existe
    await this.clientsService.findOne(clientId);

    // 2. Validar que la materia prima existe y pertenece al cliente
    const rawMaterialId = BigInt(createMovementDto.raw_material_id);
    await this.rawMaterialsService.findOne(rawMaterialId, clientId);

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
    const currentInventory = await this.inventoryService.findByClientAndRawMaterial(
      clientId,
      rawMaterialId,
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
    const movement = await this.prisma.inventory_raw_material_movements.create({
      data: {
        client_id: clientId,
        raw_material_id: rawMaterialId,
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
      rawMaterialId,
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
      rawMaterialId?: bigint;
      type?: string;
    },
  ): Promise<inventory_raw_material_movements[]> {
    const where: any = { client_id: clientId };

    if (filters?.rawMaterialId) {
      where.raw_material_id = filters.rawMaterialId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    return this.prisma.inventory_raw_material_movements.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        raw_materials: true,
      },
    });
  }

  /**
   * Obtener un movimiento específico
   */
  async findOne(id: string, clientId: bigint): Promise<inventory_raw_material_movements | null> {
    const movement = await this.prisma.inventory_raw_material_movements.findUnique({
      where: { id },
      include: { raw_materials: true },
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
   * Entradas: purchase, initial_load
   * Salidas: adjustment (si es negativo), production_usage
   */
  private isEntryMovement(type: string): boolean {
    const entryTypes = ['purchase', 'initial_load'];
    const exitTypes = ['production_usage'];

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
   * Registrar consumo de producción (llamado desde el módulo de producción)
   * Este método es usado internamente por el sistema cuando se crea una producción
   */
  async registerProductionConsumption(
    clientId: bigint,
    rawMaterialId: bigint,
    quantity: number,
    unit: string,
    productionId: string,
    notes?: string,
  ): Promise<inventory_raw_material_movements> {
    return this.createMovement(
      {
        raw_material_id: Number(rawMaterialId),
        type: 'production_usage',
        quantity,
        unit,
        reference_id: productionId,
        notes: notes || `Consumo en producción ${productionId}`,
      },
      clientId,
    );
  }
}
