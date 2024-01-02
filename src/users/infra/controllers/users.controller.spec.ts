import { Test, TestingModule } from '@nestjs/testing';
import { EncryptPort } from '../../domain/ports/encrypt.port';
import { UsersService } from '../../use-cases/users.service';
import { UsersInMemoryAdapter } from '../adapters/user.in-memory.adapter';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let persistenceAdapter: UsersInMemoryAdapter;
  const mockBcryptAdapter: EncryptPort = {
    hashPassword: jest.fn(),
    checkPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: 'UsersRepository', useClass: UsersInMemoryAdapter },
        { provide: 'EncryptPort', useValue: mockBcryptAdapter },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    persistenceAdapter = module.get<UsersInMemoryAdapter>('UsersRepository');
    mockBcryptAdapter.hashPassword = jest.fn().mockResolvedValue('123456');
    mockBcryptAdapter.checkPassword = jest.fn().mockResolvedValue(true);
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      };
      const createdUser = await controller.create(user);
      expect(createdUser).toBeDefined();
      expect(createdUser._id).toBeDefined();
      expect(createdUser.name).toEqual(user.name);
      expect(createdUser.bugs).toEqual([]);
    });
  });

  describe('FindAll', () => {
    it('Should return an array of users', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      };
      await controller.create(user);
      expect(await controller.findAll()).toBeDefined();
      expect((await controller.findAll()).length).toBe(1);
    });
  });

  describe('FindOne', () => {
    it('should return a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      };
      const createdUser = await controller.create(user);
      expect(await controller.findOne(createdUser._id)).toBeDefined();
      expect((await controller.findOne(createdUser._id)).name).toEqual(
        user.name,
      );
    });
    it('should throw an error if user not found', async () => {
      const wrongId = '123456';
      expect(controller.findOne(wrongId)).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should update a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      };
      const createdUser = await controller.create(user);
      const updatedUser = {
        name: 'John Doe2',
      };
      expect(
        await controller.update(createdUser._id, updatedUser),
      ).toBeDefined();
      expect((await controller.update(createdUser._id, updatedUser)).name).toBe(
        updatedUser.name,
      );
    });

    it('should throw an exception if user not found', async () => {
      const wrongId = '123456';
      const updatedUser = {
        name: 'John Doe2',
      };
      expect(controller.update(wrongId, updatedUser)).rejects.toThrow();
    });
  });

  describe('Delete', () => {
    it('should delete a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      };
      const createdUser = await controller.create(user);
      expect(await controller.delete(createdUser._id)).toBeDefined();
      expect(controller.findOne(createdUser._id)).rejects.toThrow();
    });
    it('should throw an exception if user not found', async () => {
      const wrongId = '123456';
      expect(controller.delete(wrongId)).rejects.toThrow();
    });
  });
});
