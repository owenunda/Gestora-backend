import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEnum } from 'class-validator';

export class CreateProductsCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Lácteos',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
    example: 'Productos derivados de la leche',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Estado de la categoría',
    example: 'active',
    enum: ['active', 'inactive'],
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['active', 'inactive'])
  @MaxLength(20)
  status: string;
}
