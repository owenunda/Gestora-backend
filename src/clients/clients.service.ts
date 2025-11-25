import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { clients, Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.clientsCreateInput): Promise<clients> {
    return this.prisma.clients.create({ data });
  }

  async findAll(): Promise<clients[]> {
    return this.prisma.clients.findMany();
  }

  async findOne(id: bigint): Promise<clients | null> {
    const client = await this.prisma.clients.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: bigint, data: Prisma.clientsUpdateInput): Promise<clients> {
    try {
      return await this.prisma.clients.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: bigint): Promise<clients> {
    try {
      return await this.prisma.clients.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      throw error;
    }
  }
}
