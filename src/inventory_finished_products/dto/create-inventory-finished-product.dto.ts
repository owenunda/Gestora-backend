import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryFinishedProductDto {
  @ApiProperty({ example: 2, description: 'ID del producto asociado' })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

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
