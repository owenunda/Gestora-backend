import { ApiProperty } from '@nestjs/swagger';

export class InventoryRawMaterialEntity {
  @ApiProperty({ example: 10 })
  id: bigint;

  @ApiProperty({ example: 1 })
  client_id: bigint;

  @ApiProperty({ example: 2 })
  raw_material_id: bigint;

  @ApiProperty({ example: 120.75 })
  quantity: number;

  @ApiProperty({ example: 'kg', enum: ['litros', 'kg', 'gramos', 'unidades'] })
  unit: string;

  @ApiProperty({ example: '2025-11-28T12:34:56.000Z' })
  updated_at?: Date | null;
}
