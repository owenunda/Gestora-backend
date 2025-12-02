import { IsNotEmpty, IsNumber, IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryFinishedProductMovementDto {
  @ApiProperty({ example: 2, description: 'ID del producto' })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({ 
    example: 'production_output', 
    enum: ['production_output', 'sale', 'adjustment', 'initial_load'],
    description: 'Tipo de movimiento: production_output (salida de producción), sale (venta), adjustment (ajuste manual), initial_load (carga inicial)' 
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['production_output', 'sale', 'adjustment', 'initial_load'])
  type: string;

  @ApiProperty({ example: 50.25, description: 'Cantidad del movimiento (positiva para entradas, negativa para salidas en adjustments)' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg', enum: ['litros', 'kg', 'gramos', 'unidades'], description: 'Unidad en la que se expresa la cantidad' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['litros', 'kg', 'gramos', 'unidades'])
  unit: string;

  @ApiPropertyOptional({ example: '8b79f3e2-1c23-45de-9af1-2c9d4e5f6a7b', description: 'UUID de referencia externa (producción, venta, etc.)' })
  @IsOptional()
  @IsString()
  reference_id?: string;

  @ApiPropertyOptional({ example: 'Salida de producción lote 2025-12-01' })
  @IsOptional()
  @IsString()
  notes?: string;
}
