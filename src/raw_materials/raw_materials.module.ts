import { Module } from '@nestjs/common';
import { RawMaterialsService } from './raw_materials.service';
import { RawMaterialsController } from './raw_materials.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule } from '../clients/clients.module';
import { SuppliersModule } from '../suppliers/suppliers.module';

@Module({
  imports: [PrismaModule, ClientsModule, SuppliersModule],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService],
  exports: [RawMaterialsService],
})
export class RawMaterialsModule {}
