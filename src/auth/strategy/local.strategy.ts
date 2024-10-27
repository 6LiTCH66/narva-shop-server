import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {UserService} from "../../user/user.service";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SingInDto } from "../../user/dto/singIn.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const dto: SingInDto = {
      email: email,
      password: password
    }

    const user = await this.userService.signInUser(dto)

    if(!user){
      throw new UnauthorizedException();
    }

    return user;
  }


}
