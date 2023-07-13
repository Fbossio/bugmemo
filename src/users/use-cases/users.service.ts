import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../domain/repositories/users.repository';
import { Users } from '../infra/models/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

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

  async create(user: Users) {
    return this.usersRepository.create(user);
  }

  async update(id: string, user: Partial<Users>) {
    return this.usersRepository.update(id, user);
  }

  async delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
