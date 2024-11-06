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
              productId: dto.productId,
              size: dto.size
            }
          },
          userId: userId
        },
        select: {
          cartItems: {
            where: {
              productId: dto.productId,
              size: dto.size
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
            quantity: true,
            id: true
          }
        })

        const duplicate = someDuplicatesInUserCart.cartItems[0]

        if(dto.quantity <= productQuantity.quantity){

          await this.prisma.product.update({
            where: {
              id: productQuantity.id,
            },
            data: {
              quantity: productQuantity.quantity - 1
            }
          })

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
      }else{

        const product = await this.prisma.product.findFirst({
          where: {
            id: dto.productId
          }
        })

        // update product quantity
        await this.prisma.product.update({
          where:{
            id: product.id
          },
          data: {
            quantity: product.quantity - dto.quantity
          }
        })

        return this.prisma.cartItems.create({
          data: {
            ...dto,
            cartId: existingCart.id
          }
        })
      }

    }
  }

  async deleteCartItem(cartItemId: number, userId: number){

    const cartItem = await this.prisma.cartItems.findFirst({
      where: {
        id: cartItemId
      }
    })

    const product = await this.prisma.product.findFirst({
      where: {
        id: cartItem.productId
      }
    })

    await this.prisma.product.update({
      where: {
        id: product.id
      },
      data: {
        quantity: product.quantity + cartItem.quantity
      }
    })

    return this.prisma.cartItems.delete({
      where: {
        id: cartItemId,
        cart: {
          userId: userId
        }
      }
    })
  }


  async editCartItemQuantity(dto: EditCartItemDto, cartItemId: number){

    const cartItem = await this.prisma.cartItems.findFirst({
      where: {
        id: cartItemId
      }
    })

    if (cartItem){

      const product = await this.prisma.product.findFirst({
        where:{
          id: cartItem.productId
        }
      })

      switch(dto.operation){
        case Operation.Decrease:

          if(cartItem.quantity > 1){
            cartItem.quantity -= dto.quantity;
            product.quantity += dto.quantity


          }else{
            cartItem.quantity = 1
          }


          break;

        case Operation.Increase:

          if(dto.quantity <= product.quantity){

            cartItem.quantity += dto.quantity;
            product.quantity -= dto.quantity

            break;
          }

      }

      await this.prisma.product.update({
        where: {
          id: product.id
        },
        data: {
          ...product
        }
      })

      return this.prisma.cartItems.update({
        where:{
          id: cartItemId
        },
        data: {
          ...cartItem
        }
      })

    }else{

      throw new NotAcceptableException("Cart item is not found!")

    }

  }

  async getUserCart(userId: number){
    return this.prisma.cart.findFirst({
      where: {
        userId: userId
      },
      select: {
        cartItems: {
          select: {
            id: true,
            size: true,
            product: true,
            quantity: true
          },
          orderBy: {
            createdAt: "asc",
          }
        }
      },

    })
  }
}
