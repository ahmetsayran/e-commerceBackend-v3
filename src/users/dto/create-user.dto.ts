import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(1)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}
