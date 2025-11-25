import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Empresa ABC S.A.S',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    description: 'Número de documento de identidad',
    example: '900123456-7',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  document_id?: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'contacto@empresa.com',
    maxLength: 150,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+57 300 1234567',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  @ApiProperty({
    description: 'Dirección física',
    example: 'Calle 123 #45-67, Bogotá',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    description: 'País',
    example: 'Colombia',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  country: string;

  @ApiProperty({
    description: 'Plan del cliente',
    example: 'premium',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  plan: string;

  @ApiProperty({
    description: 'Estado del cliente',
    example: 'active',
    enum: ['active', 'inactive', 'suspended'],
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  status: string;

  @ApiProperty({
    description: 'Hash de la contraseña',
    example: '$2b$10$...',
  })
  @IsString()
  @IsNotEmpty()
  password_hash: string;
}
