import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductionsService } from './productions.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@ApiTags('productions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/productions')
export class ProductionsController {
  constructor(private readonly productionsService: ProductionsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva producción' })
  @ApiResponse({
    status: 201,
    description: 'Producción registrada exitosamente',
  })
  create(@Request() req, @Body() createProductionDto: CreateProductionDto) {
    const clientId = req.user.clientId;
    return this.productionsService.create(clientId, createProductionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar producciones del cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de producciones obtenida exitosamente',
  })
  findAll(@Request() req) {
    const clientId = req.user.clientId;
    return this.productionsService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de producción' })
  @ApiParam({ name: 'id', description: 'ID de la producción' })
  @ApiResponse({ status: 200, description: 'Detalle de producción encontrado' })
  @ApiResponse({ status: 404, description: 'Producción no encontrada' })
  findOne(@Request() req, @Param('id', ParseBigIntPipe) id: bigint) {
    const clientId = req.user.clientId;
    return this.productionsService.findOne(Number(id), clientId);
  }
}
