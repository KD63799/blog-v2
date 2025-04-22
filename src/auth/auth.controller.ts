import {Body, Controller, Delete, Post, Req, UseGuards} from '@nestjs/common';
import {SignupDto} from "./dto/signupDto";
import {AuthService} from "./auth.service";
import {SigninDto} from "./dto/signinDto";
import {ResetPasswordDemandDto} from "./dto/resetPasswordDemandDto";
import {ResetPasswordConfirmationDto} from "./dto/ResetPasswordConfirmationDto";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {DeleteAccountDto} from "./dto/DeleteAccountDto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    signup(@Body() signupDto : SignupDto){
        return this.authService.signup(signupDto)
    }

    @Post("signin")
    signin(@Body() signinDto : SigninDto){
        return this.authService.signin(signinDto)
    }

    @Post("reset-password")
    resetPasswordDemand(@Body() resetPasswordDemandDto : ResetPasswordDemandDto){
        return this.authService.resetPasswordDemand(resetPasswordDemandDto)
    }

    @Post("reset-password-confirmation")
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto){
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete")
    deleteAccount(@Req() request: Request, @Body() deleteAccountDto : DeleteAccountDto){
        // @ts-ignore
        const userID = request.user["userID"];
        return this.authService.deleteAccount(userID, deleteAccountDto)
    }

}
