import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user-entity';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { Users } from '../models/users.schema';

@Injectable()
export class UsersMongoAdapter implements UsersRepository {
  constructor(@InjectModel(Users.name) private readonly model: Model<Users>) {}

  findAll(): Promise<User[]> {
    return this.model.find().exec();
  }
  findOne(id: string): Promise<User> {
    return this.model.findById(id).exec();
  }
  create(user: User): Promise<User> {
    const newUser = new this.model(user);
    return newUser.save();
  }
  update(id: string, user: Partial<User>): Promise<User> {
    return this.model
      .findByIdAndUpdate(id, { $set: user }, { new: true })
      .exec();
  }
  delete(id: string): Promise<User> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
