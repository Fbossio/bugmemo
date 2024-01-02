import { Test, TestingModule } from '@nestjs/testing';
import { EncryptPort } from '../domain/ports/encrypt.port';
import { UsersInMemoryAdapter } from '../infra/adapters/user.in-memory.adapter';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let persistenceAdapter: UsersInMemoryAdapter;
  const mockBcryptAdapter: EncryptPort = {
    hashPassword: jest.fn(),
    checkPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UsersRepository', useClass: UsersInMemoryAdapter },
        { provide: 'EncryptPort', useValue: mockBcryptAdapter },
      ],
    }).compile();

    persistenceAdapter = module.get<UsersInMemoryAdapter>('UsersRepository');
    service = module.get<UsersService>(UsersService);
    mockBcryptAdapter.hashPassword = jest.fn().mockResolvedValue('123456');
    mockBcryptAdapter.checkPassword = jest.fn().mockResolvedValue(true);
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const user = {
        _id: '123456opkql-lopwk',
        name: 'John Doe',
        email: 'john.gmail.com',
        password: '123456',
      };
      const userCreated = await service.create(user);
      expect(userCreated).toBeDefined();
      expect(userCreated.name).toEqual(user.name);
      expect(userCreated.bugs).toEqual([]);
    });
  });

  describe('FindAll', () => {
    it('should return an array of users', async () => {
      const user = {
        _id: '123456opkql-lopwk',
        name: 'John Doe',
        email: 'john.gmail.com',
        password: '123456',
      };
      await service.create(user);
      expect(await service.findAll()).toBeDefined();
      expect((await service.findAll()).length).toBe(1);
    });
  });

  describe('FindOne', () => {
    it('should return a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john.gmail.com',
        password: '123456',
      };
      const createdUser = await service.create(user);
      expect(await service.findOne(createdUser._id)).toBeDefined();
      expect((await service.findOne(createdUser._id)).name).toEqual(user.name);
    });
    it('should throw an exception if user not found', async () => {
      const wrongId = '123456lpkql-lopwm';
      await expect(service.findOne(wrongId)).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should update a user', async () => {
      const user = {
        _id: '123456opkql-lopwk',
        name: 'John Doe',
        email: 'john.gmail.com',
        password: '123456',
      };
      const createdUser = await service.create(user);
      const updatedUser = {
        name: 'John Doe 2',
        email: 'john2.gmail.com',
      };
      expect(await service.update(createdUser._id, updatedUser)).toBeDefined();
      expect((await service.update(createdUser._id, updatedUser)).name).toBe(
        updatedUser.name,
      );
    });
    it('should throw an exception if user not found', async () => {
      const wrongId = '123456lpkql-lopwm';
      const updatedUser = {
        name: 'John Doe 2',
      };
      await expect(service.update(wrongId, updatedUser)).rejects.toThrow();
    });
  });

  describe('Delete', () => {
    it('should delete a user', async () => {
      const user = {
        _id: '123456opkql-lopwk',
        name: 'John Doe',
        email: 'john.gmail.com',
        password: '123456',
      };
      const createdUser = await service.create(user);
      expect(await service.delete(createdUser._id)).toBeDefined();
      expect((await service.findAll()).length).toBe(0);
    });
    it('should throw an exception if user not found', async () => {
      const wrongId = '123456lpkql-lopwm';
      await expect(service.delete(wrongId)).rejects.toThrow();
    });
  });
});
