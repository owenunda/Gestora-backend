import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { InventoryFinishedProductsService } from './inventory_finished_products.service';
import { CreateInventoryFinishedProductDto } from './dto/create-inventory-finished-product.dto';
import { UpdateInventoryFinishedProductDto } from './dto/update-inventory-finished-product.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('inventory-finished-products')
@ApiBearerAuth()
@Controller('api/inventory-finished-products')
export class InventoryFinishedProductsController {
  constructor(private readonly service: InventoryFinishedProductsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener inventario actual de productos',
    description: 'Retorna el estado actual del inventario de productos terminados del cliente'
  })
  @ApiQuery({ name: 'product_id', required: false, description: 'Filtrar por producto específico' })
  @ApiResponse({ status: 200, description: 'Inventario obtenido exitosamente' })
  findAll(@Request() req, @Query('product_id') product_id?: string) {
    const clientId = BigInt(req.user.clientId);
    const productId = product_id ? BigInt(product_id) : undefined;
    return this.service.findAll(clientId, productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de inventario específico' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.findOne(BigInt(id), clientId);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear registro de inventario inicial',
    description: 'Raramente usado. Normalmente el inventario se crea automáticamente con el primer movimiento.'
  })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Ya existe un registro para este producto' })
  create(@Body() createDto: CreateInventoryFinishedProductDto, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.create(createDto, clientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar registro de inventario' })
  @ApiResponse({ status: 200, description: 'Registro actualizado exitosamente' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInventoryFinishedProductDto,
    @Request() req,
  ) {
    const clientId = BigInt(req.user.clientId);
    return this.service.update(BigInt(id), updateDto, clientId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro de inventario' })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente' })
  remove(@Param('id') id: string, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.remove(BigInt(id), clientId);
  }
}
