import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptPort } from '../users/domain/ports/encrypt.port';
import { UsersRepository } from '../users/domain/ports/users.repository';
import { UsersInMemoryAdapter } from '../users/infra/adapters/user.in-memory.adapter';
import { CreateUserDto } from '../users/infra/dto/user.dto';
import { UsersService } from '../users/use-cases/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
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
      providers: [
        AuthService,
        UsersService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'UsersRepository', useClass: UsersInMemoryAdapter },
        { provide: 'EncryptPort', useValue: mockBcryptAdapter },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    persistenceAdapter = module.get<UsersInMemoryAdapter>('UsersRepository');
    usersService = module.get<UsersService>(UsersService);
    mockBcryptAdapter.hashPassword = jest.fn().mockResolvedValue('123456');
    mockBcryptAdapter.checkPassword = jest.fn().mockResolvedValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Sign Up', () => {
    it('should create a user', async () => {
      const user: CreateUserDto = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };

      const createdUser = await service.signUp(user);
      expect(createdUser).toBeDefined();
      expect(createdUser._id).toBeDefined();
      expect(createdUser.name).toEqual(user.name);
      expect(createdUser.password).not.toEqual(user.password);
    });
    it('should throw an exception if user already exists', async () => {
      jest
        .spyOn(persistenceAdapter, 'findByEmail')
        .mockResolvedValue(true as any);
      const user: CreateUserDto = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };
      expect(service.signUp(user)).rejects.toThrow();
    });
  });

  describe('Sign In', () => {
    it('should return a token', async () => {
      const user: CreateUserDto = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };
      const createdUser = await service.signUp(user);
      const token = await service.signIn(user);
      expect(token).toBeDefined();
    });
    it('should throw an error if user does not exist', async () => {
      const user = {
        email: 'email@email.com',
        password: '123456',
      };
      expect(service.signIn(user)).rejects.toThrow('Invalid credentials');
    });
    it('should throw an error if password is incorrect', async () => {
      jest
        .spyOn(UsersService.prototype, 'checkPassword')
        .mockResolvedValue(false);
      const user: CreateUserDto = {
        name: 'John Doe',
        email: 'john@john.com',
        password: 'abcdefg',
      };
      await service.signUp(user);
      const userWithWrongPassword = {
        email: user.email,
        password: 'wrong-password',
      };
      expect(service.signIn(userWithWrongPassword)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
