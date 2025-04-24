import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Update_commentDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;
  @IsNotEmpty()
  @IsNumber()
  readonly postId: number;
}
