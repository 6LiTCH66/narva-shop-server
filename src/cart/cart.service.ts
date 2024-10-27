import { Injectable, NotAcceptableException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddCartItemDto } from "./dto/create.cart-item.dto";
import { EditCartItemDto, Operation } from "./dto/edit.cart-item.dto";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createCart(userId: number){
    return this.prisma.cart.create({
      data:{
        userId: userId,
      }
    })
  }

  async addToCart(dto: AddCartItemDto, userId: number){

    const existingCart = await this.prisma.cart.findFirst({
      where: {
        userId: userId
      }
    })

    if(!existingCart){
      // Check if the product quantity is not over of the limit
      const productQuantity = await this.prisma.product.findFirst({
        where: {
          id: dto.productId
        }
      })

      if (productQuantity.quantity >= dto.quantity){
        const newCart = await this.createCart(userId)

        return this.prisma.cartItems.create({
          data: {
            ...dto,
            cartId: newCart.id
          }
        })

      }else{

        throw new NotAcceptableException("Quantity cannot be greater than stock quantity of product!")
      }

    } else{

      // Check if item is already in cart
      const someDuplicatesInUserCart = await this.prisma.cart.findFirst({
        where: {
          cartItems: {
            some: {
              productId: dto.productId
            }
          },
          userId: userId
        },
        select: {
          cartItems: {
            where: {
              productId: dto.productId
            }
          }
        }
      })


      // Duplicate found
      if(someDuplicatesInUserCart){

        // Getting product quantity and selecting only quantity field
        const productQuantity = await this.prisma.product.findFirst({
          where: {
            id: dto.productId
          },
          select:{
            quantity: true
          }
        })

        const duplicate = someDuplicatesInUserCart.cartItems[0]

        if((duplicate.quantity + dto.quantity) < productQuantity.quantity){

          return this.prisma.cartItems.update({
            where: {
              id: duplicate.id
            },
            data: {
              quantity: duplicate.quantity + dto.quantity
            }
          })
        }else{
          throw new NotAcceptableException("Quantity cannot be greater than stock quantity of product!")
        }
      }

      return this.prisma.cartItems.create({
        data: {
          ...dto,
          cartId: existingCart.id
        }
      })
    }
  }

  async deleteCartItem(cartItemId: number){
    return this.prisma.cartItems.delete({
      where: {
        id: cartItemId
      }
    })
  }


  async editCartItemQuantity(dto: EditCartItemDto, cartItemId: number){

    const cartItem = await this.prisma.cartItems.findFirst({
      where: {
        id: cartItemId
      }
    })

    switch(dto.operation){
      case Operation.Decrease:
        // cartItem.quantity >= 1
        if(cartItem.quantity > 0){
          cartItem.quantity -= dto.quantity;

        }else{
          return this.deleteCartItem(cartItemId);
        }

        break;
      case Operation.Increase:
        cartItem.quantity += dto.quantity;
        break;
    }

    return this.prisma.cartItems.update({
      where:{
        id: cartItemId
      },
      data: {
        ...cartItem
      }
    })
  }
}
