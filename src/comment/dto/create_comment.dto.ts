import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Create_commentDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;
  @IsNotEmpty()
  @IsNumber()
  readonly postId: number;
}
