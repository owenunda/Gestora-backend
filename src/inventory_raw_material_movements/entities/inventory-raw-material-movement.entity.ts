import { ApiProperty } from '@nestjs/swagger';

export class InventoryRawMaterialMovementEntity {
  @ApiProperty({ example: 'a8f7e3d2-9c41-4b6e-91b2-3c6a9d5e1f22' })
  id: string;

  @ApiProperty({ example: 1 })
  client_id: bigint;

  @ApiProperty({ example: 2 })
  raw_material_id: bigint;

  @ApiProperty({ example: 'IN', enum: ['IN', 'OUT'] })
  type: string;

  @ApiProperty({ example: 150.5 })
  quantity: number;

  @ApiProperty({ example: 'kg', enum: ['litros', 'kg', 'gramos', 'unidades'] })
  unit: string;

  @ApiProperty({ example: 'b1c2d3e4-1234-5678-9abc-def012345678', required: false })
  reference_id?: string | null;

  @ApiProperty({ example: 'Compra semanal de materia prima', required: false })
  notes?: string | null;

  @ApiProperty({ example: '2025-11-28T12:34:56.000Z' })
  created_at?: Date | null;
}
