import { IsEmail, IsNotEmpty } from "class-validator";


export class SingInDto{

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  password: string;
}
