import { Module, forwardRef } from '@nestjs/common';
import { InventoryFinishedProductsService } from './inventory_finished_products.service';
import { InventoryFinishedProductsController } from './inventory_finished_products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [PrismaModule, ClientsModule, ProductsModule],
  controllers: [InventoryFinishedProductsController],
  providers: [InventoryFinishedProductsService],
  exports: [InventoryFinishedProductsService],
})
export class InventoryFinishedProductsModule {}
