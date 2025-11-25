import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Nombre de la empresa o proveedor',
    example: 'Distribuidora XYZ S.A.S',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'ID del cliente asociado',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiPropertyOptional({
    description: 'Nombre de la persona de contacto',
    example: 'Juan Pérez',
    maxLength: 150,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  contact_name?: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+57 300 9876543',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'ventas@distribuidoraxyz.com',
    maxLength: 150,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'Dirección física',
    example: 'Av. Industrial #10-20',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    description: 'Documento de identidad o NIT',
    example: '900.123.456-7',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  document_id: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Proveedor principal de materia prima tipo A',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Estado del proveedor',
    example: 'active',
    enum: ['active', 'inactive'],
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  status: string;
}
