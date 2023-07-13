import { randomUUID } from 'crypto';

export class User {
  _id: string;
  name: string;
  email: string;
  password: string;
  bugs?: any[];

  constructor(name: string, email: string, password: string, bugs?: any[]) {
    this._id = randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.bugs = bugs;
  }
}
