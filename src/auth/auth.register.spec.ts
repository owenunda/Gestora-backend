import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClientsService } from '../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

describe('AuthService Registration Defaults', () => {
  let authService: AuthService;
  let clientsService: ClientsService;

  const mockClientsService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    clientsService = module.get<ClientsService>(ClientsService);
  });

  it('should register a client with default plan and status', async () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'password123',
      phone: '1234567890',
      address: '123 Main St',
      country: 'Test Country',
    };

    const expectedCreatedClient = {
      ...registerDto,
      plan: 'premium',
      status: 'active',
      id: BigInt(1),
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockClientsService.create.mockResolvedValue(expectedCreatedClient);

    await authService.register(registerDto);

    expect(clientsService.create).toHaveBeenCalledWith(expect.objectContaining({
      ...registerDto,
      plan: 'premium',
      status: 'active',
      password_hash: expect.any(String),
    }));
  });
});
