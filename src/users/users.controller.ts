// src/users/users.controller.ts
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConnectedUser } from './utils/decorators/connecter-user.decorator';
import { UsersService } from './users.service';
import { GetUserDto } from './utils/dto/get-user.dto';
import { UpdateUserDto } from './utils/dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: "Get the current user's information." })
  async getMe(@ConnectedUser() userPayload: { userId: number }): Promise<GetUserDto> {
    return this.usersService.getCurrentUser(userPayload);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Get a user's information by ID." })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto> {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the user to update' })
  @ApiOperation({ summary: "Update a user's information by its ID." })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @ConnectedUser() userPayload: { userId: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return this.usersService.updateUser(userPayload.userId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete your account.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Account deleted.' })
  async delete(
    @ConnectedUser()
    userPayload: {
      userId: number;
    },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.usersService.deleteUser(userPayload.userId, id);
  }
}
