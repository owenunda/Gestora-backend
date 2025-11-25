import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { clients } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto): Promise<clients> {
    return this.prisma.clients.create({
      data: createClientDto,
    });
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

  async findByEmail(email: string): Promise<clients | null> {
    return this.prisma.clients.findFirst({
      where: { email },
    });
  }

  async update(id: bigint, updateClientDto: UpdateClientDto): Promise<clients> {
    try {
      return await this.prisma.clients.update({
        where: { id },
        data: updateClientDto,
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
