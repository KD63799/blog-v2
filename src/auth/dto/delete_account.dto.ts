import { IsNotEmpty, IsString } from 'class-validator';

export class Delete_accountDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
