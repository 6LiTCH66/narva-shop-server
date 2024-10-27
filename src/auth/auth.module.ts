import { Module } from '@nestjs/common';
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategy/local.strategy";
import { SessionSerializer } from "./serializer/session.serializer";

@Module({
  providers: [LocalStrategy, SessionSerializer],
  imports: [UserModule, PassportModule.register({session: true})]
})
export class AuthModule {}
