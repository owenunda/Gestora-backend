import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { clients, Prisma } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({
    description: 'Datos del cliente a crear',
    schema: {
      type: 'object',
      required: ['name', 'email', 'phone', 'address', 'country', 'plan', 'status', 'password_hash'],
      properties: {
        name: { type: 'string', example: 'Empresa ABC' },
        document_id: { type: 'string', example: '123456789', nullable: true },
        email: { type: 'string', example: 'contacto@empresa.com' },
        phone: { type: 'string', example: '+57 300 1234567' },
        address: { type: 'string', example: 'Calle 123 #45-67' },
        country: { type: 'string', example: 'Colombia' },
        plan: { type: 'string', example: 'premium' },
        status: { type: 'string', example: 'active' },
        password_hash: { type: 'string', example: 'hashed_password_here' },
      },
    },
  })
  create(@Body() createClientDto: Prisma.clientsCreateInput): Promise<clients> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida exitosamente' })
  findAll(): Promise<clients[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente', example: '1' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id', ParseBigIntPipe) id: bigint): Promise<clients | null> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente', example: '1' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiBody({
    description: 'Datos a actualizar del cliente',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Empresa ABC Actualizada' },
        email: { type: 'string', example: 'nuevo@empresa.com' },
        phone: { type: 'string', example: '+57 300 9876543' },
        status: { type: 'string', example: 'inactive' },
      },
    },
  })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateClientDto: Prisma.clientsUpdateInput,
  ): Promise<clients> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente', example: '1' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('id', ParseBigIntPipe) id: bigint): Promise<clients> {
    return this.clientsService.remove(id);
  }
}
