import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true, unique: true, trim: true })
  departmentName: string;

  @Prop({ required: true, trim: true })
  description: string;
}

export const DepartmentSchema =
  SchemaFactory.createForClass(Department);