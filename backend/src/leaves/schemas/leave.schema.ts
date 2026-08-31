import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeaveDocument = HydratedDocument<Leave>;

@Schema()
export class Leave {
  @Prop({ required: true })
  employeeId: string;

  @Prop({ required: true })
  leaveType: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: 'PENDING' })
  status: string;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);