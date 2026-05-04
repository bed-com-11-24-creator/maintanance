import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestStatus } from './request.entity';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // 🔐 CREATE REQUEST (STUDENT)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRequestDto, @Req() req) {
    return this.requestsService.create(dto, req.user);
  }

  // 🔐 GET ALL (ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  // 🔐 GET MY REQUESTS
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req) {
    return this.requestsService.findMyRequests(req.user.userId);
  }

  // 🔐 UPDATE STATUS (STAFF / ADMIN)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.requestsService.updateStatus(+id, status as RequestStatus);
  }
}