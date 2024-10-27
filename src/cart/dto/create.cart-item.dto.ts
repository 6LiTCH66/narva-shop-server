import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class AddCartItemDto {

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number

}
