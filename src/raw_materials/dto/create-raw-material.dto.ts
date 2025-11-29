import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsDecimal } from 'class-validator';

export class CreateRawMaterialDto {
  @ApiProperty({
    description: 'Nombre de la materia prima',
    example: 'Leche entera',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    description: 'ID del proveedor (opcional)',
    example: '1',
  })
  @IsString()
  @IsOptional()
  supplier_id?: string;

  @ApiProperty({
    description: 'Unidad de medida',
    example: 'litros',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit: string;

  @ApiPropertyOptional({
    description: 'Costo por unidad',
    example: 2500.00,
  })
  @IsOptional()
  cost_per_unit?: number;

  @ApiPropertyOptional({
    description: 'Descripción o notas adicionales',
    example: 'Leche entera para producción de queso',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Estado de la materia prima',
    example: 'active',
    enum: ['active', 'inactive'],
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  status: string;
}
