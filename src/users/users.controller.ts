import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { User } from './entities/users.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Создать пользователя',
    description: 'Только для роли ADMIN',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }
}
