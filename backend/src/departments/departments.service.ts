import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Department,
  DepartmentDocument,
} from './schemas/department.schema';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  // ==============================
  // CREATE DEPARTMENT
  // ==============================
  async create(
    departmentName: string,
    description: string,
  ) {
    const existingDepartment =
      await this.departmentModel.findOne({
        departmentName,
      });

    if (existingDepartment) {
      throw new ConflictException(
        'Department already exists',
      );
    }

    const department = new this.departmentModel({
      departmentName,
      description,
    });

    return department.save();
  }

  // ==============================
  // GET ALL DEPARTMENTS
  // ==============================
  async findAll() {
    return this.departmentModel
      .find()
      .sort({ departmentName: 1 });
  }

  // ==============================
  // GET ONE DEPARTMENT
  // ==============================
  async findOne(id: string) {
    const department =
      await this.departmentModel.findById(id);

    if (!department) {
      throw new NotFoundException(
        'Department not found',
      );
    }

    return department;
  }

  // ==============================
  // UPDATE DEPARTMENT
  // ==============================
  async update(
    id: string,
    departmentName: string,
    description: string,
  ) {
    const department =
      await this.departmentModel.findById(id);

    if (!department) {
      throw new NotFoundException(
        'Department not found',
      );
    }

    const duplicate =
      await this.departmentModel.findOne({
        departmentName,
        _id: { $ne: id },
      });

    if (duplicate) {
      throw new ConflictException(
        'Department already exists',
      );
    }

    department.departmentName = departmentName;
    department.description = description;

    return department.save();
  }

  // ==============================
  // DELETE DEPARTMENT
  // ==============================
  async remove(id: string) {
    const department =
      await this.departmentModel.findByIdAndDelete(id);

    if (!department) {
      throw new NotFoundException(
        'Department not found',
      );
    }

    return {
      message: 'Department deleted successfully',
    };
  }
}