import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @Optional()
  readonly title?: string;
  @IsNotEmpty()
  @IsString()
  @Optional()
  readonly body?: string;
}
