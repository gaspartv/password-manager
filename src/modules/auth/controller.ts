import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { Public } from "src/decorators/is-public";
import { FindUserByEmail } from "src/services/users/find-user-by-email";
import { SignInDto } from "./dtos/sign-in.dto";

@Controller()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,

    private readonly findUserByEmail: FindUserByEmail,
  ) {}

  @Public()
  @Get("/")
  @Render("login.hbs")
  loginPage() {
    return { title: "Login - Password Manager" };
  }

  @Public()
  @Post("auth/sign-in")
  async signIn(@Body() body: SignInDto) {
    const userFound = await this.findUserByEmail.execute(body.email);

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
