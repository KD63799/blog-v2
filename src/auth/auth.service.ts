import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Sign_upDto } from './dto/sign_up.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { Sign_inDto } from './dto/sign_in.dto';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';
import { Reset_password_demandDto } from './dto/reset_password_demand.dto';
import { Reset_password_confirmationDto } from './dto/reset_password_confirmation.dto';
import { Delete_accountDto } from './dto/delete_account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: Sign_upDto) {
    const { username, email, password } = signupDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('User already exists');

    const hash = await bcrypt.hash(password, 10);

    await this.prismaService.user.create({ data: { username, email, password: hash } });

    await this.mailerService.sendSignupConfirmation(email);

    return { data: 'User successfully created' };
  }

  async signin(signinDto: Sign_inDto) {
    const { email, password } = signinDto;
    const user = await this.prismaService.user.findUniqueOrThrow({ where: { email } });
    if (!user) throw new NotFoundException('User Not Found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Password Incorrect');

    const payload = {
      sub: user.userId,
      email: user.email,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '3h',
      secret: this.configService.get('SECRET_KEY'),
    });
    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async resetPasswordDemand(resetPasswordDemandDto: Reset_password_demandDto) {
    const { email } = resetPasswordDemandDto;
    const user = await this.prismaService.user.findUniqueOrThrow({ where: { email } });
    if (!user) throw new NotFoundException('User Not Found');

    const secret = this.configService.getOrThrow<string>('OTP_CODE');

    const code = speakeasy.totp({
      secret,
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
    });

    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.mailerService.sendResetPassword(email, url, code);
    return { data: 'Reset password mail has been sent' };
  }

  async resetPasswordConfirmation(resetPasswordConfirmationDto: Reset_password_confirmationDto) {
    const { email, code, password } = resetPasswordConfirmationDto;
    const user = await this.prismaService.user.findUniqueOrThrow({ where: { email } });
    if (!user) throw new NotFoundException('User Not Found');
    const secret = this.configService.getOrThrow<string>('OTP_CODE');
    const match = speakeasy.totp.verify({
      secret,
      token: code,
      digits: 6,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!match) throw new UnauthorizedException('Invalid/expired Token');
    const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({ where: { email }, data: { password: hash } });
    return { data: 'Password successfully updated' };
  }

  async deleteAccount(userId: number, deleteAccountDto: Delete_accountDto) {
    const { password } = deleteAccountDto;
    const user = await this.prismaService.user.findUniqueOrThrow({ where: { userId } });
    if (!user) throw new NotFoundException('User Not Found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Password Incorrect');

    await this.prismaService.user.delete({ where: { userId } });
    return { data: 'Account successfully deleted' };
  }
}
