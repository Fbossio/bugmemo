import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/use-cases/users.service';
import { BugsRepository } from '../domain/ports/bugs.repository';

@Injectable()
export class BugsService {
  constructor(
    @Inject('BugsRepository') private readonly bugsRepository: BugsRepository,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.bugsRepository.findAll();
  }

  async findAllByUser(userId: string) {
    return await this.bugsRepository.findAllByUser(userId);
  }

  async findOne(id: string) {
    return await this.bugsRepository.findOne(id);
  }

  async create(bug: any, userId: string) {
    const bugObj = { ...bug, user: userId };

    const createdBug = await this.bugsRepository.create(bugObj);
    if (!createdBug) return null;
    const bugId = createdBug._id;

    const userWithBug = await this.usersService.addBug(userId, bugId);
    if (!userWithBug) {
      await this.bugsRepository.delete(bugId);
      return null;
    }

    return createdBug;
  }

  async update(id: string, bug: Partial<any>) {
    return await this.bugsRepository.update(id, bug);
  }

  async delete(id: string) {
    return await this.bugsRepository.delete(id);
  }
}
