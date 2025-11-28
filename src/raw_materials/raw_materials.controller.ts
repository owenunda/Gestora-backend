import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RawMaterialsService } from './raw_materials.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { raw_materials } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('raw-materials')
@ApiBearerAuth()
@Controller('api/raw-materials')
export class RawMaterialsController {
  constructor(private readonly rawMaterialsService: RawMaterialsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva materia prima' })
  @ApiResponse({ status: 201, description: 'Materia prima creada exitosamente', type: CreateRawMaterialDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createRawMaterialDto: CreateRawMaterialDto): Promise<raw_materials> {
    return this.rawMaterialsService.create(createRawMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias primas' })
  @ApiResponse({ status: 200, description: 'Lista de materias primas obtenida exitosamente' })
  findAll(): Promise<raw_materials[]> {
    return this.rawMaterialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una materia prima por ID' })
  @ApiParam({ name: 'id', description: 'ID de la materia prima', example: '1' })
  @ApiResponse({ status: 200, description: 'Materia prima encontrada' })
  @ApiResponse({ status: 404, description: 'Materia prima no encontrada' })
  findOne(@Param('id', ParseBigIntPipe) id: bigint): Promise<raw_materials | null> {
    return this.rawMaterialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una materia prima',
    description: 'Actualiza parcialmente los datos de una materia prima existente.'
  })
  @ApiParam({ name: 'id', description: 'ID de la materia prima', example: '1' })
  @ApiResponse({ status: 200, description: 'Materia prima actualizada exitosamente', type: CreateRawMaterialDto })
  @ApiResponse({ status: 404, description: 'Materia prima no encontrada' })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateRawMaterialDto: UpdateRawMaterialDto,
  ): Promise<raw_materials> {
    return this.rawMaterialsService.update(id, updateRawMaterialDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar una materia prima',
    description: 'Elimina permanentemente una materia prima. No se puede deshacer.'
  })
  @ApiParam({ name: 'id', description: 'ID de la materia prima', example: '1' })
  @ApiResponse({ status: 200, description: 'Materia prima eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Materia prima no encontrada' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar porque tiene registros relacionados' })
  remove(@Param('id', ParseBigIntPipe) id: bigint): Promise<raw_materials> {
    return this.rawMaterialsService.remove(id);
  }
}
