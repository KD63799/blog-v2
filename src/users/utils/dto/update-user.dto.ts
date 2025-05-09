import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  readonly username?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  // @IsOptional()
  // @IsString()
  // @MinLength(6)
  // readonly password?: string;
}
