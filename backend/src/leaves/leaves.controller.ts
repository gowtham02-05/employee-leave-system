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

@Controller('leaves')
@UseGuards(JwtGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

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
  async approveLeave(@Param('id') id: string) {
    return this.leavesService.approveLeave(id);
  }

  @Patch(':id/reject')
  async rejectLeave(@Param('id') id: string) {
    return this.leavesService.rejectLeave(id);
  }
}