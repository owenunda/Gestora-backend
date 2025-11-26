import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { clients } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private clientsService: ClientsService,
    private jwtService: JwtService,
  ) {}

  async validateClient(email: string, pass: string): Promise<any> {
    const client = await this.clientsService.findByEmail(email);

    if (client && (await bcrypt.compare(pass, client.password_hash))) {
      const { password_hash, ...result } = client;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const client = await this.validateClient(loginDto.email, loginDto.password);
    if (!client) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Convertir BigInt a string para el payload del JWT
    const payload = { email: client.email, sub: client.id.toString() };
    
    return {
      access_token: this.jwtService.sign(payload),
      client,
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password_hash, 10);
    
    const newClient = await this.clientsService.create({
      ...registerDto,
      password_hash: hashedPassword,
    });

    const { password_hash, ...result } = newClient;
    return result;
  }
}
