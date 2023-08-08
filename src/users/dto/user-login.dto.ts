import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
