import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Timestamp } from 'typeorm';

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
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  date: Timestamp;
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  priority: number;
  @IsNotEmpty()
  @IsBoolean()
  done: boolean;
}
