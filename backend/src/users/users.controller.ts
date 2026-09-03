import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // ==============================
  // GET ALL USERS
  // ==============================

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  // ==============================
  // CREATE EMPLOYEE ACCOUNT
  // ==============================

  @Post('register')
  async register(@Body() body: any) {
    return this.usersService.createUser(
      body.employeeId,
      body.name,
      body.email,
      body.password,
      body.phone,
      body.department,
      body.designation,
      body.doj,
      Number(body.leaveBalance) || 12,
    );
  }

  // ==============================
  // UPDATE EMPLOYEE
  // ==============================

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.usersService.updateUser(id, body);
  }

  // ==============================
  // DELETE EMPLOYEE
  // ==============================

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}