import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { products } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('products')
@ApiBearerAuth()
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo producto',
    description: 'Crea un nuevo producto. Para agregar una imagen, primero súbela usando POST /api/upload/product-image y luego usa la URL retornada en el campo image_url.'
  })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: CreateProductDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductDto: CreateProductDto, @Request() req): Promise<products> {
    const clientId = BigInt(req.user.clientId);
    return this.productsService.create(createProductDto, clientId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente' })
  findAll(@Request() req): Promise<products[]> {
    const clientId = BigInt(req.user.clientId);
    return this.productsService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: '1' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseBigIntPipe) id: bigint, @Request() req): Promise<products> {
    const clientId = BigInt(req.user.clientId);
    return this.productsService.findOne(id, clientId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un producto',
    description: 'Actualiza parcialmente los datos de un producto existente. Si se actualiza image_url, la imagen anterior se eliminará automáticamente de R2.'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: '1' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente', type: CreateProductDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req
  ): Promise<products> {
    const clientId = BigInt(req.user.clientId);
    return this.productsService.update(id, updateProductDto, clientId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar un producto',
    description: 'Elimina permanentemente un producto y su imagen asociada de R2. No se puede deshacer.'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: '1' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar porque tiene registros relacionados' })
  remove(@Param('id', ParseBigIntPipe) id: bigint, @Request() req): Promise<products> {
    const clientId = BigInt(req.user.clientId);
    return this.productsService.remove(id, clientId);
  }
}
