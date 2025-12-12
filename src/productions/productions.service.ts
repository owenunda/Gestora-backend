import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionDto } from './dto/create-production.dto';

@Injectable()
export class ProductionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: number, createProductionDto: CreateProductionDto) {
    const { production_date, batch_code, notes, materials, products } =
      createProductionDto;

    return this.prisma.$transaction(async (tx) => {
      // 1. (Conditional) Handle Raw Materials
      if (materials && materials.length > 0) {
        for (const material of materials) {
          const inventory = await tx.inventory_raw_materials.findFirst({
            where: {
              client_id: BigInt(clientId),
              raw_material_id: BigInt(material.raw_material_id),
            },
          });

          if (!inventory || Number(inventory.quantity) < material.quantity) {
            throw new BadRequestException(
              `Insufficient raw material inventory for ID ${material.raw_material_id}`,
            );
          }

          // Deduct from inventory
          await tx.inventory_raw_materials.update({
            where: { id: inventory.id },
            data: {
              quantity: {
                decrement: material.quantity,
              },
            },
          });

          // Create movement
          await tx.inventory_raw_material_movements.create({
            data: {
              client_id: BigInt(clientId),
              raw_material_id: BigInt(material.raw_material_id),
              type: 'production_usage',
              quantity: material.quantity,
              unit: material.unit,
              notes: `Production usage${batch_code ? ` (Batch: ${batch_code})` : ''}`,
            },
          });
        }
      }

      // 2. Handle Finished Products
      for (const product of products) {
        // Upsert inventory
        const existingInventory = await tx.inventory_finished_products.findFirst(
          {
            where: {
              client_id: BigInt(clientId),
              product_id: BigInt(product.product_id),
            },
          },
        );

        if (existingInventory) {
          await tx.inventory_finished_products.update({
            where: { id: existingInventory.id },
            data: {
              quantity: {
                increment: product.quantity,
              },
            },
          });
        } else {
          await tx.inventory_finished_products.create({
            data: {
              client_id: BigInt(clientId),
              product_id: BigInt(product.product_id),
              quantity: product.quantity,
              unit: product.unit,
            },
          });
        }

        // Create movement
        await tx.inventory_finished_product_movements.create({
          data: {
            client_id: BigInt(clientId),
            product_id: BigInt(product.product_id),
            type: 'production_output',
            quantity: product.quantity,
            unit: product.unit,
            notes: `Production output${batch_code ? ` (Batch: ${batch_code})` : ''}`,
          },
        });
      }

      // 3. Create Production Record
      const production = await tx.productions.create({
        data: {
          client_id: BigInt(clientId),
          production_date: new Date(production_date),
          batch_code,
          notes,
          status: 'completed',
        },
      });

      // 4. Create Production Details
      if (materials && materials.length > 0) {
        await tx.production_materials.createMany({
          data: materials.map((m) => ({
            production_id: production.id,
            raw_material_id: BigInt(m.raw_material_id),
            quantity: m.quantity,
            unit: m.unit,
          })),
        });
      }

      await tx.production_products.createMany({
        data: products.map((p) => ({
          production_id: production.id,
          product_id: BigInt(p.product_id),
          quantity: p.quantity,
          unit: p.unit,
        })),
      });

      return production;
    });
  }

  async findAll(clientId: number) {
    return this.prisma.productions.findMany({
      where: {
        client_id: BigInt(clientId),
      },
      include: {
        production_materials: {
          include: {
            raw_materials: true,
          },
        },
        production_products: {
          include: {
            products: true,
          },
        },
      },
      orderBy: {
        production_date: 'desc',
      },
    });
  }

  async findOne(id: number, clientId: number) {
    const production = await this.prisma.productions.findFirst({
      where: {
        id: BigInt(id),
        client_id: BigInt(clientId),
      },
      include: {
        production_materials: {
          include: {
            raw_materials: true,
          },
        },
        production_products: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!production) {
      return null;
    }

    return production;
  }
}
