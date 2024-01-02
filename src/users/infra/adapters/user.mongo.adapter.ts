import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user-entity';
import { UsersRepository } from '../../domain/ports/users.repository';
import { Users } from '../models/users.schema';

@Injectable()
export class UsersMongoAdapter implements UsersRepository {
  constructor(@InjectModel(Users.name) private readonly model: Model<Users>) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.model.findOne({ email }).exec();
    if (!user) return null;

    return User.createFromData(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.model.find().exec();
    return users.map((user) => User.createFromData(user));
  }
  async findOne(id: string): Promise<User> {
    const user = await this.model.findById(id).populate('bugs').exec();
    return User.createFromData(user);
  }
  async create(user: User): Promise<User> {
    const newUser = new User(user.name, user.email, user.password);
    const modelUser = new this.model(newUser);
    const result = await modelUser.save();
    return User.createFromData(result);
  }
  async update(id: string, user: Partial<User>): Promise<User> {
    const foundUser = await this.model.findById(id).exec();
    if (!foundUser) {
      throw new Error('User not found');
    }
    const userInstance = User.createFromData(foundUser);

    userInstance.updateDate();

    Object.assign(userInstance, user);
    const updatedUser = await this.model
      .findByIdAndUpdate(id, { $set: userInstance }, { new: true })
      .exec();
    return User.createFromData(updatedUser);
  }
  async delete(id: string): Promise<User> {
    const deletedUser = await this.model.findByIdAndDelete(id).exec();
    return new User(
      deletedUser.name,
      deletedUser.email,
      deletedUser.password,
      deletedUser.bugs,
    );
  }

  async addBug(userId: string, bugId: string): Promise<User> {
    const user = await this.model
      .findByIdAndUpdate(userId, { $addToSet: { bugs: bugId } }, { new: true })
      .exec();
    return User.createFromData(user);
  }
}
