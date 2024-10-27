import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  password: string;


}
