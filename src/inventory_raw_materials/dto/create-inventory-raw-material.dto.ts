import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryRawMaterialDto {
  @ApiProperty({ example: 2, description: 'ID de la materia prima asociada' })
  @IsNotEmpty()
  @IsNumber()
  raw_material_id: number;

  @ApiProperty({ example: 120.75, description: 'Cantidad inicial' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg', enum: ['litros', 'kg', 'gramos', 'unidades'], description: 'Unidad de medida' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['litros', 'kg', 'gramos', 'unidades'])
  unit: string;
}
