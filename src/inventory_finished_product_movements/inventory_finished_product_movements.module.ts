import { Module, forwardRef } from '@nestjs/common';
import { InventoryFinishedProductMovementsService } from './inventory_finished_product_movements.service';
import { InventoryFinishedProductMovementsController } from './inventory_finished_product_movements.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';
import { InventoryFinishedProductsModule } from '../inventory_finished_products/inventory_finished_products.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule,
    ProductsModule,
    InventoryFinishedProductsModule,
  ],
  controllers: [InventoryFinishedProductMovementsController],
  providers: [InventoryFinishedProductMovementsService],
  exports: [InventoryFinishedProductMovementsService],
})
export class InventoryFinishedProductMovementsModule {}
