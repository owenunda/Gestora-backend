import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const mockClientsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: typeof mockClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
        ...createClientDto,
        created_at: new Date(),
        updated_at: new Date(),
        document_id: null,
      };

      service.create.mockResolvedValue(expectedClient);

      const result = await controller.create(createClientDto);

      expect(result).toEqual(expectedClient);
      expect(service.create).toHaveBeenCalledWith(createClientDto);
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
      ];

      service.findAll.mockResolvedValue(expectedClients);

      const result = await controller.findAll();

      expect(result).toEqual(expectedClients);
      expect(service.findAll).toHaveBeenCalled();
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

      service.findOne.mockResolvedValue(expectedClient);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedClient);
      expect(service.findOne).toHaveBeenCalledWith(id);
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

      service.update.mockResolvedValue(expectedClient);

      const result = await controller.update(id, updateClientDto);

      expect(result).toEqual(expectedClient);
      expect(service.update).toHaveBeenCalledWith(id, updateClientDto);
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

      service.remove.mockResolvedValue(expectedClient);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedClient);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
