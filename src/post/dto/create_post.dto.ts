import { IsNotEmpty, IsString } from 'class-validator';

export class Create_postDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  readonly body: string;
}
