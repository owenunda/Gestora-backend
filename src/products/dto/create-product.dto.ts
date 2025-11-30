import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsDecimal, IsEnum, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Queso Fresco',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Unidad de medida',
    example: 'kg',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit: string;

  @ApiPropertyOptional({
    description: 'Rendimiento por defecto',
    example: 1.00,
  })
  @IsOptional()
  default_yield?: number;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Queso fresco artesanal',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Estado del producto',
    example: 'active',
    enum: ['active', 'inactive'],
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['active', 'inactive'])
  @MaxLength(20)
  status: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría',
    example: '1',
  })
  @IsString()
  @IsOptional()
  category_id?: string;
}
