import { Controller, Get, UseGuards, Param, Put, Delete, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user.enums';

@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(UserRole.ADMINISTRATOR)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMINISTRATOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @ApiBody({
    schema: {
      properties: {
        FULL_NAME: { type: 'string', example: 'Donata Banda' },
        EMAIL: { type: 'string', example: 'chisomo@chanco.ac.mw' },
        ROLE: { type: 'string', example: 'student' },
        REG_NUMBER: { type: 'string', example: 'bsc/com/01/25' },
        PHONE: { type: 'string', example: '0999111222' },
      },
    },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(id, data);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}