import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { InventoryRawMaterialMovementsService } from './inventory_raw_material_movements.service';
import { CreateInventoryRawMaterialMovementDto } from './dto/create-inventory-raw-material-movement.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('inventory-raw-material-movements')
@ApiBearerAuth()
@Controller('api/inventory-raw-material-movements')
export class InventoryRawMaterialMovementsController {
  constructor(private readonly service: InventoryRawMaterialMovementsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Registrar un movimiento de inventario',
    description: `
Registra un movimiento de inventario y actualiza automáticamente el inventario actual.

**Tipos de movimiento:**
- **purchase**: Compra de materia prima (entrada)
- **initial_load**: Carga inicial de inventario (entrada)
- **adjustment**: Ajuste manual positivo o negativo (entrada)
- **production_usage**: Consumo en producción (salida) - normalmente usado automáticamente por el sistema

**Flujo:**
1. Valida que hay suficiente inventario (para salidas)
2. Crea el registro del movimiento
3. Actualiza el inventario actual
4. Retorna el movimiento creado

**Ejemplo - Compra:**
\`\`\`json
{
  "raw_material_id": 2,
  "type": "purchase",
  "quantity": 100,
  "unit": "litros",
  "notes": "Compra semanal proveedor XYZ"
}
\`\`\`

**Ejemplo - Ajuste (derrame):**
\`\`\`json
{
  "raw_material_id": 2,
  "type": "adjustment",
  "quantity": -5,
  "unit": "litros",
  "notes": "Derrame en almacén"
}
\`\`\`
    `
  })
  @ApiResponse({ status: 201, description: 'Movimiento creado y aplicado al inventario exitosamente' })
  @ApiResponse({ status: 400, description: 'Inventario insuficiente o datos inválidos' })
  create(@Body() createDto: CreateInventoryRawMaterialMovementDto, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.createMovement(createDto, clientId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener historial de movimientos',
    description: 'Retorna todos los movimientos de inventario del cliente, ordenados por fecha (más recientes primero)'
  })
  @ApiQuery({ name: 'raw_material_id', required: false, description: 'Filtrar por materia prima específica' })
  @ApiQuery({ name: 'type', required: false, enum: ['purchase', 'adjustment', 'production_usage', 'initial_load'], description: 'Filtrar por tipo de movimiento' })
  @ApiResponse({ status: 200, description: 'Historial obtenido exitosamente' })
  findAll(
    @Request() req,
    @Query('raw_material_id') raw_material_id?: string,
    @Query('type') type?: string,
  ) {
    const clientId = BigInt(req.user.clientId);
    const filters: any = {};

    if (raw_material_id) {
      filters.rawMaterialId = BigInt(raw_material_id);
    }

    if (type) {
      filters.type = type;
    }

    return this.service.findAll(clientId, filters);
  }
}
