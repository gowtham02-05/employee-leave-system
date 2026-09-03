import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // ==============================
  // CREATE USER
  // ==============================
  async createUser(
    employeeId: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    department: string,
    designation: string,
    doj: string,
    leaveBalance: number = 12,
  ) {
    const existingEmail =
      await this.userModel.findOne({ email });

    if (existingEmail) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const existingEmployeeId =
      await this.userModel.findOne({ employeeId });

    if (existingEmployeeId) {
      throw new BadRequestException(
        'Employee ID already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new this.userModel({
      employeeId,
      name,
      email,
      password: hashedPassword,

      // Employee accounts must always be EMPLOYEE
      role: 'EMPLOYEE',

      phone,
      department,
      designation,
      doj,
      leaveBalance,
      status: 'Active',
    });

    return user.save();
  }

  // ==============================
  // FIND USER BY EMAIL
  // ==============================
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  // ==============================
  // GET ALL USERS
  // ==============================
  async findAll() {
    return this.userModel
      .find(
        {},
        {
          password: 0,
        },
      )
      .sort({ name: 1 });
  }

  // ==============================
  // UPDATE USER
  // ==============================
  async updateUser(
    id: string,
    data: any,
  ) {
    const user =
      await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        'Employee not found',
      );
    }

    // Check email is already used by another employee
    if (data.email) {
      const existingEmail =
        await this.userModel.findOne({
          email: data.email,
          _id: { $ne: id },
        });

      if (existingEmail) {
        throw new BadRequestException(
          'Email already exists',
        );
      }
    }

    // Check employee ID is already used by another employee
    if (data.employeeId) {
      const existingEmployeeId =
        await this.userModel.findOne({
          employeeId: data.employeeId,
          _id: { $ne: id },
        });

      if (existingEmployeeId) {
        throw new BadRequestException(
          'Employee ID already exists',
        );
      }
    }

    // Update password only if a new password is provided
    if (data.password) {
      data.password = await bcrypt.hash(
        data.password,
        10,
      );
    } else {
      delete data.password;
    }

    // Never allow HR/Admin role to be changed through employee edit
    delete data.role;

    const updatedUser =
      await this.userModel.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        },
      ).select('-password');

    return updatedUser;
  }

  // ==============================
  // DELETE USER
  // ==============================
  async deleteUser(id: string) {
    const user =
      await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        'Employee not found',
      );
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'Employee deleted successfully',
    };
  }
}