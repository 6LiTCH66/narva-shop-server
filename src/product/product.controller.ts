import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create.product.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { AuthenticatedGuard } from "../auth/guard/authenticated.guard";

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}


  @UseGuards(AuthenticatedGuard)
  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{name: 'image'}]))
  createNewProduct(@UploadedFile() _file: Express.Multer.File, @Body() product: CreateProductDto){
    return this.productService.createProduct(product)
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  getAllProducts(){
    return this.productService.getAllProducts()
  }


  @UseGuards(AuthenticatedGuard)
  @Get("/:id")
  getProductDetails(@Param("id", ParseIntPipe) productId: number){
    return this.productService.getProductDetails(productId)
  }


}
