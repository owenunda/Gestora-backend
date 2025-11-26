import { CreateClientDto } from '../../clients/dto/create-client.dto';

import { OmitType } from '@nestjs/swagger';

export class RegisterDto extends OmitType(CreateClientDto, ['plan', 'status'] as const) {}
