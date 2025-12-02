import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { InventoryFinishedProductMovementsService } from './inventory_finished_product_movements.service';
import { CreateInventoryFinishedProductMovementDto } from './dto/create-inventory-finished-product-movement.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('inventory-finished-product-movements')
@ApiBearerAuth()
@Controller('api/inventory-finished-product-movements')
export class InventoryFinishedProductMovementsController {
  constructor(private readonly service: InventoryFinishedProductMovementsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Registrar un movimiento de inventario de productos',
    description: `
Registra un movimiento de inventario y actualiza automáticamente el inventario actual.

**Tipos de movimiento:**
- **production_output**: Salida de producción (entrada al inventario)
- **sale**: Venta de producto (salida del inventario)
- **adjustment**: Ajuste manual positivo o negativo
- **initial_load**: Carga inicial de inventario (entrada)

**Flujo:**
1. Valida que hay suficiente inventario (para salidas)
2. Crea el registro del movimiento
3. Actualiza el inventario actual
4. Retorna el movimiento creado

**Ejemplo - Salida de Producción:**
\`\`\`json
{
  "product_id": 2,
  "type": "production_output",
  "quantity": 50,
  "unit": "kg",
  "notes": "Producción lote 2025-12-01"
}
\`\`\`

**Ejemplo - Venta:**
\`\`\`json
{
  "product_id": 2,
  "type": "sale",
  "quantity": 10,
  "unit": "kg",
  "notes": "Venta cliente ABC"
}
\`\`\`

**Ejemplo - Ajuste (producto dañado):**
\`\`\`json
{
  "product_id": 2,
  "type": "adjustment",
  "quantity": -3,
  "unit": "kg",
  "notes": "Producto dañado"
}
\`\`\`
    `
  })
  @ApiResponse({ status: 201, description: 'Movimiento creado y aplicado al inventario exitosamente' })
  @ApiResponse({ status: 400, description: 'Inventario insuficiente o datos inválidos' })
  create(@Body() createDto: CreateInventoryFinishedProductMovementDto, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.createMovement(createDto, clientId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener historial de movimientos de productos',
    description: 'Retorna todos los movimientos de inventario del cliente, ordenados por fecha (más recientes primero)'
  })
  @ApiQuery({ name: 'product_id', required: false, description: 'Filtrar por producto específico' })
  @ApiQuery({ name: 'type', required: false, enum: ['production_output', 'sale', 'adjustment', 'initial_load'], description: 'Filtrar por tipo de movimiento' })
  @ApiResponse({ status: 200, description: 'Historial obtenido exitosamente' })
  findAll(
    @Request() req,
    @Query('product_id') product_id?: string,
    @Query('type') type?: string,
  ) {
    const clientId = BigInt(req.user.clientId);
    const filters: any = {};

    if (product_id) {
      filters.productId = BigInt(product_id);
    }

    if (type) {
      filters.type = type;
    }

    return this.service.findAll(clientId, filters);
  }
}
