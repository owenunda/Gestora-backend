import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@ApiBearerAuth()
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product-image')
  @ApiOperation({ summary: 'Subir imagen de producto' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 201, 
    description: 'Imagen subida exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Imagen subida exitosamente' },
        imageUrl: { type: 'string', example: 'https://cdn.example.com/products/1/abc-123.jpg' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido o no proporcionado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, WEBP, máximo 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const clientId = BigInt(req.user.clientId);
    const imageUrl = await this.uploadService.uploadProductImage(file, clientId);

    return {
      message: 'Imagen subida exitosamente',
      imageUrl,
    };
  }
}
