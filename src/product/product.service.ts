import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create.product.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createProduct(dto: CreateProductDto){
    dto.image = `${this.config.get("BASED_URL")}/uploads/${dto.image}`
    return this.prisma.product.create({
      data: {
        ...dto,
      }
    })
  }

  async getAllProducts(){
    return this.prisma.product.findMany()
  }

  async getProductDetails(productId: number){
    return this.prisma.product.findFirst({
      where: {
        id: productId
      }
    })
  }
}
