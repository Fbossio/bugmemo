import { User } from '../entities/user-entity';

export interface UsersRepository {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<User>;
  addBug(userId: string, bugId: string): Promise<User>;
}
