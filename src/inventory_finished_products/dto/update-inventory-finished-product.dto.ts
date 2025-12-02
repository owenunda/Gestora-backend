import { PartialType } from '@nestjs/swagger';
import { CreateInventoryFinishedProductDto } from './create-inventory-finished-product.dto';

export class UpdateInventoryFinishedProductDto extends PartialType(CreateInventoryFinishedProductDto) {}
