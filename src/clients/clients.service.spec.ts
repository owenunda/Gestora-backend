import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const mockPrismaService = {
  clients: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '123456789',
        address: 'Test Address',
        country: 'Test Country',
        plan: 'basic',
        status: 'active',
        password_hash: 'hashed_password',
      };

      const expectedClient = {
        id: BigInt(1),
        created_at: new Date(),
        updated_at: new Date(),
        document_id: null,
        ...createClientDto,
      };

      prisma.clients.create.mockResolvedValue(expectedClient);

      const result = await service.create(createClientDto);

      expect(result).toEqual(expectedClient);
      expect(prisma.clients.create).toHaveBeenCalledWith({
        data: createClientDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const expectedClients = [
        {
          id: BigInt(1),
          name: 'Client 1',
          email: 'client1@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: BigInt(2),
          name: 'Client 2',
          email: 'client2@example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      prisma.clients.findMany.mockResolvedValue(expectedClients);

      const result = await service.findAll();

      expect(result).toEqual(expectedClients);
      expect(prisma.clients.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const id = BigInt(1);
      const expectedClient = {
        id,
        name: 'Test Client',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.clients.findUnique.mockResolvedValue(expectedClient);

      const result = await service.findOne(id);

      expect(result).toEqual(expectedClient);
      expect(prisma.clients.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const id = BigInt(999);
      prisma.clients.findUnique.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const id = BigInt(1);
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Name',
      };

      const expectedClient = {
        id,
        name: 'Updated Name',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.clients.update.mockResolvedValue(expectedClient);

      const result = await service.update(id, updateClientDto);

      expect(result).toEqual(expectedClient);
      expect(prisma.clients.update).toHaveBeenCalledWith({
        where: { id },
        data: updateClientDto,
      });
    });

    it('should throw NotFoundException if client to update not found', async () => {
      const id = BigInt(999);
      const updateClientDto: UpdateClientDto = { name: 'Updated Name' };
      
      const error = new Error('Record to update not found.');
      (error as any).code = 'P2025';

      prisma.clients.update.mockRejectedValue(error);

      await expect(service.update(id, updateClientDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      const id = BigInt(1);
      const expectedClient = {
        id,
        name: 'Test Client',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.clients.delete.mockResolvedValue(expectedClient);

      const result = await service.remove(id);

      expect(result).toEqual(expectedClient);
      expect(prisma.clients.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if client to remove not found', async () => {
      const id = BigInt(999);
      
      const error = new Error('Record to delete not found.');
      (error as any).code = 'P2025';

      prisma.clients.delete.mockRejectedValue(error);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
