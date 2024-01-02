import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ _id: false })
export class Users {
  @Prop({ required: true })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  bugs?: any[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.index({ email: 1 }, { unique: true });
