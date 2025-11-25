import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { clients } from '@prisma/client';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createClientDto: CreateClientDto): Promise<clients> {
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
  @ApiOperation({ 
    summary: 'Actualizar un cliente',
    description: 'Actualiza parcialmente los datos de un cliente existente. Solo los campos enviados serán actualizados, los demás permanecerán sin cambios.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del cliente a actualizar', 
    example: '1',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente actualizado exitosamente. Retorna el cliente con todos sus datos actualizados.',
    type: CreateClientDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos. Verifica que los campos cumplan con las validaciones requeridas.'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente no encontrado. El ID proporcionado no existe en la base de datos.'
  })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<clients> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar un cliente',
    description: 'Elimina permanentemente un cliente del sistema. Esta acción no se puede deshacer. Se recomienda verificar que el cliente no tenga registros relacionados antes de eliminarlo.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del cliente a eliminar', 
    example: '1',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente eliminado exitosamente. Retorna los datos del cliente eliminado.',
    type: CreateClientDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente no encontrado. El ID proporcionado no existe en la base de datos.'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflicto. El cliente no puede ser eliminado porque tiene registros relacionados (productos, proveedores, etc.).'
  })
  remove(@Param('id', ParseBigIntPipe) id: bigint): Promise<clients> {
    return this.clientsService.remove(id);
  }
}
