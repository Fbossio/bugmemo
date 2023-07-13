import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../use-cases/users.service';
import { UsersInMemoryAdapter } from '../adapters/user.in-memory.adapter';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let persistenceAdapter: UsersInMemoryAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: 'UsersRepository', useClass: UsersInMemoryAdapter },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    persistenceAdapter = module.get<UsersInMemoryAdapter>('UsersRepository');
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
      };
      expect(await controller.create(user)).toBeDefined();
      expect((await controller.create(user))._id).toBeDefined();
      expect((await controller.create(user)).name).toEqual(user.name);
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
