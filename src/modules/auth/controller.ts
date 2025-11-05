import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { createHash } from "crypto";
import { Public } from "src/decorators/is-public";
import { FindUserByEmail } from "src/services/users/find-user-by-email";
import { SignInDto } from "./dtos/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,

    private readonly findUserByEmail: FindUserByEmail,
  ) {}

  @Public()
  @Post("sign-in")
  async signIn(@Body() body: SignInDto) {
    const email = createHash("sha256").update(body.email).digest("hex");

    const userFound = await this.findUserByEmail.execute(email);

    if (!userFound) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const passwordIsValid = bcrypt.compareSync(
      body.password,
      userFound.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const payload = { sub: userFound.id, username: userFound.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
