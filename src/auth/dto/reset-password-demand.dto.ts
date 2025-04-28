import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDemandDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
}
