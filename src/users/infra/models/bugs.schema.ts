import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BugStatus } from '../../../bugs/domain/entities/bug-entity';

export type BugsDocument = HydratedDocument<Bugs>;

@Schema({ _id: false })
export class Bugs {
  @Prop({ required: true })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  user: string;

  @Prop()
  status?: BugStatus;

  @Prop()
  description?: string;

  @Prop()
  tags?: string[];

  @Prop()
  bugImages?: string[];

  @Prop()
  bugFix?: string;

  @Prop()
  fixLinks?: string[];

  @Prop()
  fixImages?: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BugsSchema = SchemaFactory.createForClass(Bugs);
BugsSchema.index({ title: 1 }, { unique: true });
