import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { suppliers } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('api/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente', type: CreateSupplierDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createSupplierDto: CreateSupplierDto, @Request() req): Promise<suppliers> {
    const clientId = BigInt(req.user.clientId);
    return this.suppliersService.create(createSupplierDto, clientId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({ status: 200, description: 'Lista de proveedores obtenida exitosamente' })
  findAll(@Request() req): Promise<suppliers[]> {
    const clientId = BigInt(req.user.clientId);
    return this.suppliersService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del proveedor', example: '1' })
  @ApiResponse({ status: 200, description: 'Proveedor encontrado' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  findOne(@Param('id', ParseBigIntPipe) id: bigint, @Request() req): Promise<suppliers | null> {
    const clientId = BigInt(req.user.clientId);
    return this.suppliersService.findOne(id, clientId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un proveedor',
    description: 'Actualiza parcialmente los datos de un proveedor existente.'
  })
  @ApiParam({ name: 'id', description: 'ID del proveedor', example: '1' })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado exitosamente', type: CreateSupplierDto })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Request() req
  ): Promise<suppliers> {
    const clientId = BigInt(req.user.clientId);
    return this.suppliersService.update(id, updateSupplierDto, clientId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar un proveedor',
    description: 'Elimina permanentemente un proveedor. No se puede deshacer.'
  })
  @ApiParam({ name: 'id', description: 'ID del proveedor', example: '1' })
  @ApiResponse({ status: 200, description: 'Proveedor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar porque tiene registros relacionados' })
  remove(@Param('id', ParseBigIntPipe) id: bigint, @Request() req): Promise<suppliers> {
    const clientId = BigInt(req.user.clientId);
    return this.suppliersService.remove(id, clientId);
  }
}
