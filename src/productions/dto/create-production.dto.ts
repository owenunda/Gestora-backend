import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductionMaterialDto {
  @ApiProperty({ description: 'ID de la materia prima', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  raw_material_id: number;

  @ApiProperty({ description: 'Cantidad utilizada', example: 10.5 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'Unidad de medida', example: 'kg' })
  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class ProductionProductDto {
  @ApiProperty({ description: 'ID del producto terminado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ description: 'Cantidad producida', example: 50 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'Unidad de medida', example: 'unidades' })
  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class CreateProductionDto {
  @ApiProperty({
    description: 'Fecha de la producción',
    example: '2025-12-12T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  production_date: string;

  @ApiProperty({
    description: 'Código de lote (opcional)',
    example: 'LOTE-2025-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  batch_code?: string;

  @ApiProperty({
    description: 'Notas adicionales (opcional)',
    example: 'Producción de prueba',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Lista de materias primas utilizadas (opcional)',
    type: [ProductionMaterialDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductionMaterialDto)
  @IsOptional()
  materials?: ProductionMaterialDto[];

  @ApiProperty({
    description: 'Lista de productos terminados generados',
    type: [ProductionProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductionProductDto)
  @IsNotEmpty()
  products: ProductionProductDto[];
}
