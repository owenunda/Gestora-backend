import { Module } from '@nestjs/common';
import { ProductsCategoriesController } from './products_categories.controller';
import { ProductsCategoriesService } from './products_categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
  exports: [ProductsCategoriesService]
})
export class ProductsCategoriesModule {}
