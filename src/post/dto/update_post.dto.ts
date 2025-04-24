import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class Update_postDto {
  @IsNotEmpty()
  @IsString()
  @Optional()
  readonly title?: string;
  @IsNotEmpty()
  @IsString()
  @Optional()
  readonly body?: string;
}
