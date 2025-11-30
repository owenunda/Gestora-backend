import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryRawMaterialMovementsService } from './inventory_raw_material_movements.service';
import { InventoryRawMaterialMovementsController } from './inventory_raw_material_movements.controller';
import { ClientsModule } from '../clients/clients.module';
import { RawMaterialsModule } from '../raw_materials/raw_materials.module';
import { InventoryRawMaterialsModule } from '../inventory_raw_materials/inventory_raw_materials.module';

@Module({
  imports: [PrismaModule, ClientsModule, RawMaterialsModule, InventoryRawMaterialsModule],
  controllers: [InventoryRawMaterialMovementsController],
  providers: [InventoryRawMaterialMovementsService],
  exports: [InventoryRawMaterialMovementsService], // Exportar para usar en producción
})
export class InventoryRawMaterialMovementsModule {}
