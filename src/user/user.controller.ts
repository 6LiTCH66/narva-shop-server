import { Body, Controller, Get, Post, UseGuards, Delete, Res, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { SingInDto } from "./dto/singIn.dto";
import { LocalAuthGuard } from "../auth/guard/local.auth.guard";
import { AuthenticatedGuard } from "../auth/guard/authenticated.guard";
import { GetUser } from "../auth/decorator/get-user.decorator";
import {Request, Response} from 'express'

@Controller('user')
export class UserController {
  constructor(private  userService: UserService) {}

  @Post('signup')
  signup(@Body() user: UserDto){
    return this.userService.createNewUser(user);
  }


  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() dto: SingInDto, @Req() req: Request, @Res() res: Response){
    const user = await this.userService.signInUser(dto)
    return res.json({
      user: user,
      sessionId: req.sessionID
    })
  }

  @UseGuards(AuthenticatedGuard)
  @Delete("logout")
  logout(@Req() req: Request, @Res() res: Response){
    req.session.destroy(null)
    res.clearCookie("connect.sid")
    return res.send({message: "You have been signed out successfully!"})
  }


  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getMe(@GetUser() user: UserDto){
    return user;
  }
}
