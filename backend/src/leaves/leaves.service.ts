import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave } from './schemas/leave.schema';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leave.name)
    private readonly leaveModel: Model<Leave>,
  ) {}

  async applyLeave(
    employeeId: string,
    leaveType: string,
    startDate: Date,
    endDate: Date,
    reason: string,
  ) {
    const leave = new this.leaveModel({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return leave.save();
  }

  async getAllLeaves() {
    return this.leaveModel.find().exec();
  }

  async approveLeave(id: string) {
    const leave = await this.leaveModel.findByIdAndUpdate(
      id,
      { status: 'APPROVED' },
      { new: true },
    );

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }

  async rejectLeave(id: string) {
    const leave = await this.leaveModel.findByIdAndUpdate(
      id,
      { status: 'REJECTED' },
      { new: true },
    );

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }
}