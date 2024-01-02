import { Bug } from '../entities/bug-entity';

export interface BugsRepository {
  findAll(): Promise<Bug[]>;
  findAllByUser(userId: string): Promise<Bug[]>;
  findOne(id: string): Promise<Bug>;
  create(bug: Bug): Promise<Bug>;
  update(id: string, bug: Partial<Bug>): Promise<Bug>;
  delete(id: string): Promise<Bug>;
}
