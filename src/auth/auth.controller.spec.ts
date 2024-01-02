import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptPort } from '../users/domain/ports/encrypt.port';
import { UsersRepository } from '../users/domain/ports/users.repository';
import { UsersInMemoryAdapter } from '../users/infra/adapters/user.in-memory.adapter';
import { UsersService } from '../users/use-cases/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let usersService: UsersService;
  let persistenceAdapter: UsersRepository;
  const mockJwtService: Partial<JwtService> = {
    sign: jest.fn(() => 'signed-token'),
  };
  const mockBcryptAdapter: EncryptPort = {
    hashPassword: jest.fn(),
    checkPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        { provide: 'UsersRepository', useClass: UsersInMemoryAdapter },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'EncryptPort', useValue: mockBcryptAdapter },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    persistenceAdapter = module.get<UsersInMemoryAdapter>('UsersRepository');
    usersService = module.get<UsersService>(UsersService);
    mockBcryptAdapter.hashPassword = jest.fn().mockResolvedValue('123456');
    mockBcryptAdapter.checkPassword = jest.fn().mockResolvedValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SignUp', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };
      const createdUser = await controller.signUp(user);
      expect(createdUser).toBeDefined();
      expect(createdUser._id).toBeDefined();
    });
    it('should throw an exception if user already exists', async () => {
      jest
        .spyOn(persistenceAdapter, 'findByEmail')
        .mockResolvedValue(true as any);
      const user = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };
      expect(controller.signUp(user)).rejects.toThrow();
    });
  });
  describe('SignIn', () => {
    it('should return a token', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };
      await controller.signUp(user);
      const token = await controller.signIn(user);
      expect(token).toBeDefined();
    });
    it('should throw an error if user does not exist', async () => {
      const user = {
        email: 'john@john.com',
        password: 'abcdefg',
      };
      expect(controller.signIn(user)).rejects.toThrow('Invalid credentials');
    });
  });
});
