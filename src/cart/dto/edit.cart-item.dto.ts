import { IsEnum, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export enum Operation{
  Increase = "increase",
  Decrease = "decrease"
}

export class EditCartItemDto{

  @IsNotEmpty()
  @IsEnum(Operation)
  operation: Operation

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  quantity: number;
}
