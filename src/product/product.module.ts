import { Module, Request } from "@nestjs/common";
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from "@nestjs/platform-express";
import * as multer from 'multer';
import * as path from "path";
import { CreateProductDto } from "./dto/create.product.dto";

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {

          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const filename = file.originalname + '-' + uniqueSuffix + path.extname(file.originalname);
          cb(null, filename);

          req.body.image = filename

        },
      }),
    }),
  ]
})
export class ProductModule {}
