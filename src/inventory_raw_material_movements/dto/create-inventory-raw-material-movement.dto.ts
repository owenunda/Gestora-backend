import { IsNotEmpty, IsNumber, IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryRawMaterialMovementDto {
  @ApiProperty({ example: 2, description: 'ID de la materia prima' })
  @IsNotEmpty()
  @IsNumber()
  raw_material_id: number;

  @ApiProperty({ 
    example: 'purchase', 
    enum: ['purchase', 'adjustment', 'production_usage', 'initial_load'],
    description: 'Tipo de movimiento: purchase (compra), adjustment (ajuste manual), production_usage (consumo en producción), initial_load (carga inicial)' 
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['purchase', 'adjustment', 'production_usage', 'initial_load'])
  type: string;

  @ApiProperty({ example: 50.25, description: 'Cantidad del movimiento (positiva para entradas, negativa para salidas)' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg', enum: ['litros', 'kg', 'gramos', 'unidades'], description: 'Unidad en la que se expresa la cantidad' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['litros', 'kg', 'gramos', 'unidades'])
  unit: string;

  @ApiPropertyOptional({ example: '8b79f3e2-1c23-45de-9af1-2c9d4e5f6a7b', description: 'UUID de referencia externa (producción, compra, etc.)' })
  @IsOptional()
  @IsString()
  reference_id?: string;

  @ApiPropertyOptional({ example: 'Entrada por compra semanal' })
  @IsOptional()
  @IsString()
  notes?: string;
}
