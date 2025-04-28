import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDemandDto } from './dto/reset-password-demand.dto';
import { ResetPasswordConfirmationDto } from './dto/reset-password-confirmation.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ConnectedUser } from '../users/utils/decorators/connecter-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @Post('signup')
  signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: SignInDto })
  @Post('signin')
  signin(@Body() signinDto: SignInDto) {
    return this.authService.signin(signinDto);
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ResetPasswordDemandDto })
  @Post('reset-password')
  resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
    return this.authService.resetPasswordDemand(resetPasswordDemandDto);
  }

  @ApiOperation({ summary: 'Confirm password reset' })
  @ApiBody({ type: ResetPasswordConfirmationDto })
  @Post('reset-password-confirmation')
  resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
    return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
  }

  @ApiOperation({ summary: 'Delete user account' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: DeleteAccountDto })
  @Delete('delete')
  deleteAccount(@ConnectedUser() user: User, @Req() request: Request, @Body() deleteAccountDto: DeleteAccountDto) {
    const userID = (request.user as any).userID;
    console.log(user);
    return this.authService.deleteAccount(userID, deleteAccountDto);
  }
}
