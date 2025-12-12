import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('ACCOUNT_ID_CLOUDFLARE');
    const accessKeyId = this.configService.get<string>('ACCESS_KEY_ID_CLOUDFLARE');
    const secretAccessKey = this.configService.get<string>('SECRET_ACCESS_KEY_CLOUDFLARE');

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2 credentials are not configured in environment variables. Please set ACCOUNT_ID_CLOUDFLARE, ACCESS_KEY_ID_CLOUDFLARE, and SECRET_ACCESS_KEY_CLOUDFLARE');
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucketName = this.configService.get<string>('NAME_BUCKET_CLOUDFLARE') || 'gestora-product-images';
    this.publicUrl = this.configService.get<string>('CDN_URL_CLOUDFLARE') || '';
  }

  async uploadProductImage(file: Express.Multer.File, clientId: bigint): Promise<string> {
    // Validar tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten imágenes (JPG, PNG, WEBP)');
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('La imagen no puede superar los 5MB');
    }

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `products/${clientId}/${uuidv4()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Retornar la URL pública
      return `${this.publicUrl}/${fileName}`;
    } catch (error) {
      console.error('Error uploading to R2:', error);
      throw new BadRequestException('Error al subir la imagen a R2');
    }
  }

  async deleteProductImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !this.publicUrl) {
      return;
    }

    try {
      // Extraer el key del URL
      const key = imageUrl.replace(`${this.publicUrl}/`, '');

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error al eliminar imagen de R2:', error);
      // No lanzamos error para no bloquear otras operaciones
    }
  }
}
