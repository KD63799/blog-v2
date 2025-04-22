import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {SignupDto} from "./dto/signupDto";
import * as bcrypt from "bcrypt";
import {PrismaService} from "../prisma/prisma.service";
import {MailerService} from "../mailer/mailer.service";
import {SigninDto} from "./dto/signinDto";
import {JwtService} from "@nestjs/jwt";
import * as speakeasy from "speakeasy";
import {ConfigService} from "@nestjs/config";
import {ResetPasswordDemandDto} from "./dto/resetPasswordDemandDto";
import {ResetPasswordConfirmationDto} from "./dto/ResetPasswordConfirmationDto";
import {DeleteAccountDto} from "./dto/DeleteAccountDto";

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
                private readonly mailerService: MailerService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
    ) {
    }

    async signup(signupDto: SignupDto) {
        const {username, email, password} = signupDto;
        const user = await this.prismaService.user.findUnique({where: {email}})
        if (user) throw new ConflictException("User already exists")

        const hash = await bcrypt.hash(password, 10)

        await this.prismaService.user.create({data: {username, email, password: hash}})

        await this.mailerService.sendSignupConfirmation(email);

        return {data: "User successfully created"}
    }

    async signin(signinDto: SigninDto) {
        const {email, password} = signinDto
        const user = await this.prismaService.user.findUnique({where: {email}})
        if (!user) throw new NotFoundException("User Not Found");

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new UnauthorizedException("Password Incorrect")

        const payload = {
            sub: user.userId,
            email: user.email
        }
        const token = this.jwtService.sign(payload,
            {
                expiresIn: "3h",
                secret: this.configService.get("SECRET_KEY"),
            });
        return {
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        }
    }

    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
        const {email} = resetPasswordDemandDto;
        const user = await this.prismaService.user.findUnique({where: {email}})
        if (!user) throw new NotFoundException("User Not Found");

        const secret = this.configService.getOrThrow<string>('OTP_CODE');

        const code = speakeasy.totp({
            secret,
            digits: 6,
            step: 60 * 15,
            encoding: 'base32',
        });

        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.mailerService.sendResetPassword(email, url, code)
        return {data: "Reset password mail has been sent"}

    }

    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const {email, code, password} = resetPasswordConfirmationDto;
        const user = await this.prismaService.user.findUnique({where: {email}})
        if (!user) throw new NotFoundException("User Not Found");
        const secret = this.configService.getOrThrow<string>('OTP_CODE');
        const match = speakeasy.totp.verify({
            secret,
            token: code,
            digits: 6,
            step: 60 * 15,
            encoding: 'base32',
        });
        if (!match) throw new UnauthorizedException("Invalid/expired Token")
        const hash = await bcrypt.hash(password, 10)
        await this.prismaService.user.update({where: {email}, data: {password: hash}})
        return {data: "Password successfully updated"}
    }


    async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
        const {password} = deleteAccountDto;
        const user = await this.prismaService.user.findUnique({where: {userId}})
        if (!user) throw new NotFoundException("User Not Found");

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new UnauthorizedException("Password Incorrect")

        await this.prismaService.user.delete({where: {userId}})
        return {data: "Account successfully deleted"}

    }
}
