import { Module } from '@nestjs/common';
import { ProductionsService } from './productions.service';
import { ProductionsController } from './productions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductionsController],
  providers: [ProductionsService],
  exports: [ProductionsService],
})
export class ProductionsModule {}
