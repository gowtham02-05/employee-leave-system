import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  employeeId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['ADMIN', 'HR', 'EMPLOYEE'],
    default: 'EMPLOYEE',
  })
  role: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  department: string;

  @Prop({ trim: true })
  designation: string;

  @Prop()
  doj: string;

  @Prop({ default: 12 })
  leaveBalance: number;

  @Prop({ default: 'Active' })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);