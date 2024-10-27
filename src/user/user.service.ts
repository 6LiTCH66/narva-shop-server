import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt'
import { SingInDto } from "./dto/singIn.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createNewUser(dto: UserDto){
    try{
      const hashedPassword = await bcrypt.hash(dto.password, 5);

      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        }
      })

      const {password, ...info} = user

      return info;


    }catch(error){
      throw new ForbiddenException("Credentials are taken");
    }

  }

  async signInUser(dto: SingInDto){

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if(!user){
      throw new ForbiddenException("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password)

    if(!passwordMatch){
      throw new ForbiddenException("Password is incorrect");
    }

    const {password, ...info} = user

    return info;

  }

}
