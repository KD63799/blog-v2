import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Reset_password_demandDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
}
