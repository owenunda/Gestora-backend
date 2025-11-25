import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    try {
      const val = BigInt(value);
      if (val < 0) {
        throw new BadRequestException('ID must be a positive number');
      }
      return val;
    } catch (error) {
      throw new BadRequestException('ID must be a valid number');
    }
  }
}
