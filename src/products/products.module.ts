import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsCategoriesModule } from '../products_categories/products_categories.module';

@Module({
  imports: [PrismaModule, ProductsCategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
