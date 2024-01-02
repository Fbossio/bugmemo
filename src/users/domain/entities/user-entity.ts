import { randomUUID } from 'crypto';

export class User {
  _id: string;
  name: string;
  email: string;
  password: string;
  bugs?: any[];
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, email: string, password: string, bugs?: any[]) {
    this._id = randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.bugs = bugs;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateDate() {
    this.updatedAt = new Date();
  }

  static createFromData(data: Partial<User>) {
    const user = new User('', '', '');
    user._id = data._id;
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;
    user.bugs = data.bugs;
    user.createdAt = data.createdAt;
    user.updatedAt = data.updatedAt;
    return user;
  }
}
