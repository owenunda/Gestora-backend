import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { InventoryFinishedProductsModule } from './inventory_finished_products/inventory_finished_products.module';
import { InventoryFinishedProductMovementsModule } from './inventory_finished_product_movements/inventory_finished_product_movements.module';
import { UploadModule } from './upload/upload.module';
import { ProductionsModule } from './productions/productions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    ClientsModule, 
    SuppliersModule, 
    AuthModule, 
    RawMaterialsModule, 
    InventoryRawMaterialsModule, 
    InventoryRawMaterialMovementsModule, 
    ProductsCategoriesModule, 
    ProductsModule, 
    InventoryFinishedProductsModule, 
    InventoryFinishedProductMovementsModule,
    UploadModule,
    ProductionsModule,
  ],
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
