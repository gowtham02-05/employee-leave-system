import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
  ) {}

  // ==============================
  // CREATE
  // POST /departments
  // ==============================
  @Post()
  async create(@Body() body: any) {
    return this.departmentsService.create(
      body.departmentName,
      body.description,
    );
  }

  // ==============================
  // READ ALL
  // GET /departments
  // ==============================
  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  // ==============================
  // READ ONE
  // GET /departments/:id
  // ==============================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  // ==============================
  // UPDATE
  // PUT /departments/:id
  // ==============================
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.departmentsService.update(
      id,
      body.departmentName,
      body.description,
    );
  }

  // ==============================
  // DELETE
  // DELETE /departments/:id
  // ==============================
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}