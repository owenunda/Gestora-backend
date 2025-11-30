import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryRawMaterialDto } from './create-inventory-raw-material.dto';

export class UpdateInventoryRawMaterialDto extends PartialType(CreateInventoryRawMaterialDto) {}
