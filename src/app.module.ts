import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RawMaterialsModule } from './raw_materials/raw_materials.module';
import { InventoryRawMaterialsModule } from './inventory_raw_materials/inventory_raw_materials.module';
import { InventoryRawMaterialMovementsModule } from './inventory_raw_material_movements/inventory_raw_material_movements.module';
import { ProductsCategoriesModule } from './products_categories/products_categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [PrismaModule, ClientsModule, SuppliersModule, AuthModule, RawMaterialsModule, InventoryRawMaterialsModule, InventoryRawMaterialMovementsModule, ProductsCategoriesModule, ProductsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
