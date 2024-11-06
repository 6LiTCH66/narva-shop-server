import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from "class-validator";
import { ValidationPipe } from "@nestjs/common";
import * as session from "express-session";
import { PrismaClient } from "@prisma/client";
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
import * as passport from "passport";
import { config } from "rxjs";

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), {fallbackOnErrors: true})
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}))

  const prisma = new PrismaClient();

  app.enableCors({
    allowedHeaders: ["Authorization", 'Content-Type'],
    origin: true,
    credentials: true
  })

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24,
      },
      store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000, // 2 minutes, remove expired sessions
          dbRecordIdIsSessionId: true, // Use the session ID as the primary key in the database
        }
      )
    }),
  );

  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(port, "0.0.0.0");
}
bootstrap();
