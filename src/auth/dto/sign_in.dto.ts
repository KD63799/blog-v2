import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Sign_inDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
