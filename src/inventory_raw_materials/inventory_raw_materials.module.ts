import { Module } from '@nestjs/common';
import { InventoryRawMaterialsService } from './inventory_raw_materials.service';
import { InventoryRawMaterialsController } from './inventory_raw_materials.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule } from '../clients/clients.module';
import { RawMaterialsModule } from '../raw_materials/raw_materials.module';

@Module({
  imports: [PrismaModule, ClientsModule, RawMaterialsModule],
  controllers: [InventoryRawMaterialsController],
  providers: [InventoryRawMaterialsService],
  exports: [InventoryRawMaterialsService], // Exportar para usar en movements
})
export class InventoryRawMaterialsModule {}
