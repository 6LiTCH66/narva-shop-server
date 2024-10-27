import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";


enum Size{
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class CreateProductDto{
  @IsNotEmpty()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(Size, { each: true })
  size: Size[]

  @IsNotEmpty()
  image: string
}
