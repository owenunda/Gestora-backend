import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsCategoriesModule } from '../products_categories/products_categories.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, ProductsCategoriesModule, UploadModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
