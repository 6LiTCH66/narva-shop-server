import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddCartItemDto } from "./dto/create.cart-item.dto";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { AuthenticatedGuard } from "../auth/guard/authenticated.guard";
import { EditCartItemDto } from "./dto/edit.cart-item.dto";

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('add')
  addToCart(@Body() dto: AddCartItemDto, @GetUser('id') userId: number) {
    return this.cartService.addToCart(dto, userId)
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('remove/:id')
  deleteCartItem(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.cartService.deleteCartItem(id, userId)
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('edit/:id')
  editCartItem(@Param('id', ParseIntPipe) cartItemId: number, @Body() dto: EditCartItemDto, @GetUser('id') userId: number) {
    return this.cartService.editCartItemQuantity(dto, cartItemId)
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getUserCart(@GetUser('id') userId: number) {
    return this.cartService.getUserCart(userId)
  }
}
