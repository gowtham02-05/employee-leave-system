import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { LeavesService } from './leaves.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('leaves')
@UseGuards(JwtGuard, RolesGuard)
export class LeavesController {
  constructor(
    private readonly leavesService: LeavesService,
  ) {}

  @Post('apply')
  async applyLeave(@Body() body: any) {
    return this.leavesService.applyLeave(
      body.employeeId,
      body.leaveType,
      body.startDate,
      body.endDate,
      body.reason,
    );
  }

  @Get()
  async getAllLeaves() {
    return this.leavesService.getAllLeaves();
  }

  @Patch(':id/approve')
  @Roles('HR')
  async approveLeave(@Param('id') id: string) {
    return this.leavesService.approveLeave(id);
  }

  @Patch(':id/reject')
  @Roles('HR')
  async rejectLeave(@Param('id') id: string) {
    return this.leavesService.rejectLeave(id);
  }
}