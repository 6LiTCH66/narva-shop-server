import { IsEnum, IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { Size } from "../../product/dto/create.product.dto";

export class AddCartItemDto {

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsEnum(Size)
  size: Size

}
