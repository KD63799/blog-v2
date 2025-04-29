import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { ConnectedUser } from './utils/decorators/connecter-user.decorator';
import { GetUserDto } from './utils/dto/get-user.dto';
import { UpdateUserDto } from './utils/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@ConnectedUser() user: { userId: number }): Promise<GetUserDto> {
    return this.usersService.getUserById(user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @ConnectedUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return this.usersService.updateUser(user.userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  delete(@ConnectedUser() user: { userId: number }, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(user.userId, id);
  }
}
