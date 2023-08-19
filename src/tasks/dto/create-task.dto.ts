import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  userid: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsArray()
  day: number[];
  @IsNotEmpty()
  @IsString()
  hour: string;
  @IsNotEmpty()
  @IsString()
  instructor: string;
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
