import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { clients, Prisma } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: Prisma.clientsCreateInput): Promise<clients> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(): Promise<clients[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint): Promise<clients | null> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateClientDto: Prisma.clientsUpdateInput,
  ): Promise<clients> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseBigIntPipe) id: bigint): Promise<clients> {
    return this.clientsService.remove(id);
  }
}
