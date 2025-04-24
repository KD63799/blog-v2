import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Sign_upDto } from './dto/sign_up.dto';
import { Sign_inDto } from './dto/sign_in.dto';
import { Reset_password_demandDto } from './dto/reset_password_demand.dto';
import { Reset_password_confirmationDto } from './dto/reset_password_confirmation.dto';
import { Delete_accountDto } from './dto/delete_account.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: Sign_upDto })
  @Post('signup')
  signup(@Body() signupDto: Sign_upDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: Sign_inDto })
  @Post('signin')
  signin(@Body() signinDto: Sign_inDto) {
    return this.authService.signin(signinDto);
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: Reset_password_demandDto })
  @Post('reset-password')
  resetPasswordDemand(@Body() resetPasswordDemandDto: Reset_password_demandDto) {
    return this.authService.resetPasswordDemand(resetPasswordDemandDto);
  }

  @ApiOperation({ summary: 'Confirm password reset' })
  @ApiBody({ type: Reset_password_confirmationDto })
  @Post('reset-password-confirmation')
  resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: Reset_password_confirmationDto) {
    return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
  }

  @ApiOperation({ summary: 'Delete user account' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: Delete_accountDto })
  @Delete('delete')
  deleteAccount(@Req() request: Request, @Body() deleteAccountDto: Delete_accountDto) {
    const userID = (request.user as any).userID;
    return this.authService.deleteAccount(userID, deleteAccountDto);
  }
}
