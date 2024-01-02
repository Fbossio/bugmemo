import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bugs } from '../../../users/infra/models/bugs.schema';
import { Bug } from '../../domain/entities/bug-entity';
import { BugsRepository } from '../../domain/ports/bugs.repository';

@Injectable()
export class BugsMongoAdapter implements BugsRepository {
  constructor(@InjectModel(Bugs.name) private readonly model: Model<Bugs>) {}
  async findAll(): Promise<Bug[]> {
    const bugs = await this.model.find().exec();
    return bugs.map((bug) => Bug.createFromData(bug));
  }

  async findAllByUser(userId: string): Promise<Bug[]> {
    const bugs = await this.model.find({ user: userId }).exec();
    return bugs.map((bug) => Bug.createFromData(bug));
  }

  async findOne(id: string): Promise<Bug> {
    const bug = await this.model.findById(id).exec();
    return Bug.createFromData(bug);
  }
  async create(bug: Bug): Promise<Bug> {
    const newBug = new Bug(bug.title, bug.user);
    const modelBug = new this.model(newBug);
    const result = await modelBug.save();
    return Bug.createFromData(result);
  }
  async update(id: string, bug: Partial<Bug>): Promise<Bug> {
    const foundBug = await this.model.findById(id).exec();
    if (!foundBug) {
      throw new Error('Bug not found');
    }
    const bugInstance = Bug.createFromData(foundBug);
    bugInstance.updateDate();
    Object.assign(bugInstance, bug);

    const updatedBug = await this.model
      .findByIdAndUpdate(id, { $set: bugInstance }, { new: true })
      .exec();
    return Bug.createFromData(updatedBug);
  }
  async delete(id: string): Promise<Bug> {
    const deletedBug = await this.model.findByIdAndDelete(id).exec();
    return Bug.createFromData(deletedBug);
  }
}
