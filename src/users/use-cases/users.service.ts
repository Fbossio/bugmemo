import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user-entity';
import { EncryptPort } from '../domain/ports/encrypt.port';
import { UsersRepository } from '../domain/ports/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject('EncryptPort')
    private readonly encryptPort: EncryptPort,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async checkPassword(password: string, hashedPassword: string) {
    return this.encryptPort.checkPassword(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return this.encryptPort.hashPassword(password);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(user: any) {
    try {
      const userExists = await this.usersRepository.findByEmail(user.email);
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const { name, email, password } = user;
      const hash = await this.hashPassword(password);
      const newUser = new User(name, email, hash);

      return this.usersRepository.create(newUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, user: Partial<User>) {
    return this.usersRepository.update(id, user);
  }

  async delete(id: string) {
    return this.usersRepository.delete(id);
  }

  async addBug(userId: string, bugId: string) {
    return this.usersRepository.addBug(userId, bugId);
  }
}
