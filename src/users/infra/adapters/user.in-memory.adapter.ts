import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user-entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class UsersInMemoryAdapter implements UsersRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }
  async findOne(id: string): Promise<User> {
    const user = this.users.find((user) => user._id === id);
    return user;
  }
  async create(user: User): Promise<User> {
    user.bugs = [];
    this.users.push(user);
    return user;
  }
  async update(id: string, user: Partial<User>): Promise<User> {
    const index = this.users.findIndex((user) => user._id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }
  async delete(id: string): Promise<User> {
    const index = this.users.findIndex((user) => user._id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    const [deletedUser] = this.users.splice(index, 1);
    return deletedUser;
  }
}
