import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { env } from "src/env.config";
import { AuthController } from "./controller";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
