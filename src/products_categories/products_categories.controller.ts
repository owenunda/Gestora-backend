import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsCategoriesService } from './products_categories.service';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';
import { products_categories } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('products-categories')
@ApiBearerAuth()
@Controller('api/products-categories')
export class ProductsCategoriesController {
  constructor(private readonly productsCategoriesService: ProductsCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría de productos' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente', type: CreateProductsCategoryDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductsCategoryDto: CreateProductsCategoryDto, @Request() req): Promise<products_categories> {
    const clientId = BigInt(req.user.clientId);
    return this.productsCategoriesService.create(createProductsCategoryDto, clientId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías de productos' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente' })
  findAll(@Request() req): Promise<products_categories[]> {
    const clientId = BigInt(req.user.clientId);
    return this.productsCategoriesService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: '1' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseBigIntPipe) id: bigint, @Request() req): Promise<products_categories | null> {
    const clientId = BigInt(req.user.clientId);
    return this.productsCategoriesService.findOne(id, clientId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una categoría',
    description: 'Actualiza parcialmente los datos de una categoría existente.'
  })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: '1' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente', type: CreateProductsCategoryDto })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateProductsCategoryDto: UpdateProductsCategoryDto,
    @Request() req
  ): Promise<products_categories> {
    const clientId = BigInt(req.user.clientId);
    return this.productsCategoriesService.update(id, updateProductsCategoryDto, clientId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar una categoría',
    description: 'Elimina permanentemente una categoría. No se puede deshacer.'
  })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: '1' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar porque tiene productos relacionados' })
  remove(@Param('id', ParseBigIntPipe) id: bigint, @Request() req): Promise<products_categories> {
    const clientId = BigInt(req.user.clientId);
    return this.productsCategoriesService.remove(id, clientId);
  }
}
