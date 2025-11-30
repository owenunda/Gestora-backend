import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InventoryRawMaterialsService } from './inventory_raw_materials.service';
import { CreateInventoryRawMaterialDto } from './dto/create-inventory-raw-material.dto';
import { UpdateInventoryRawMaterialDto } from './dto/update-inventory-raw-material.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('inventory-raw-materials')
@ApiBearerAuth()
@Controller('api/inventory-raw-materials')
export class InventoryRawMaterialsController {
  constructor(private readonly service: InventoryRawMaterialsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener inventario actual de materias primas',
    description: 'Retorna el estado actual del inventario (cuánto hay de cada materia prima)'
  })
  @ApiQuery({ name: 'raw_material_id', required: false, description: 'Filtrar por materia prima específica' })
  @ApiResponse({ status: 200, description: 'Inventario obtenido exitosamente' })
  findAll(@Request() req, @Query('raw_material_id') raw_material_id?: string) {
    const clientId = BigInt(req.user.clientId);
    const rawMaterialId = raw_material_id ? BigInt(raw_material_id) : undefined;
    return this.service.findAll(clientId, rawMaterialId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de inventario por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro de inventario', example: '1' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  findOne(@Param('id', ParseBigIntPipe) id: bigint, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.findOne(id, clientId);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear registro de inventario inicial (raramente usado)',
    description: 'Normalmente el inventario se crea automáticamente con el primer movimiento. Use este endpoint solo para casos especiales.',
  })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  @ApiResponse({ status: 400, description: 'El registro ya existe o datos inválidos' })
  create(@Body() createDto: CreateInventoryRawMaterialDto, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.create(createDto, clientId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar registro de inventario',
    description: 'ADVERTENCIA: Esto actualiza directamente el inventario sin crear un movimiento. Use el endpoint de movimientos para cambios normales.'
  })
  @ApiParam({ name: 'id', description: 'ID del registro de inventario', example: '1' })
  @ApiResponse({ status: 200, description: 'Registro actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateDto: UpdateInventoryRawMaterialDto,
    @Request() req,
  ) {
    const clientId = BigInt(req.user.clientId);
    return this.service.update(id, updateDto, clientId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar registro de inventario',
    description: 'Elimina permanentemente un registro de inventario. No se puede deshacer.'
  })
  @ApiParam({ name: 'id', description: 'ID del registro de inventario', example: '1' })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  remove(@Param('id', ParseBigIntPipe) id: bigint, @Request() req) {
    const clientId = BigInt(req.user.clientId);
    return this.service.remove(id, clientId);
  }
}
