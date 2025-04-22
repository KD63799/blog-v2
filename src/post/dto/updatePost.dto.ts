import {IsNotEmpty, IsOptional} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class UpdatePostDto {
    @IsNotEmpty()
    @ApiPropertyOptional()
    @IsOptional()
    readonly title?: string
    @IsNotEmpty()
    @ApiPropertyOptional()
    @IsOptional()
    readonly body?: string;
}