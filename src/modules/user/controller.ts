import { Body, Controller, Get, Post, Render } from "@nestjs/common";
import { Public } from "src/decorators/is-public";
import { ConfirmUserService } from "src/services/users/confirm-user";
import { CreateUserService } from "src/services/users/create-user";
import { ForgotPasswordService } from "src/services/users/forgot-password";
import { ResetPasswordService } from "src/services/users/reset-password";
import { ConfirmUserDto } from "./dtos/confirm-user.dto";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { UserCreateDto } from "./dtos/user-create.dto";

@Controller("user")
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly confirmUserService: ConfirmUserService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Public()
  @Get("register")
  @Render("register.hbs")
  registerPage() {
    return { title: "Criar Conta" };
  }

  @Public()
  @Post("create")
  createUser(@Body() userCreateDto: UserCreateDto) {
    return this.createUserService.execute(userCreateDto);
  }

  @Public()
  @Get("confirm-register")
  @Render("confirm-register.hbs")
  confirmRegisterPage() {
    return { title: "Confirmar Registro" };
  }

  @Public()
  @Post("confirm-register")
  confirmRegister(@Body() confirmUserDto: ConfirmUserDto) {
    return this.confirmUserService.execute(confirmUserDto.token);
  }

  @Public()
  @Get("forgot-password")
  @Render("forgot-password.hbs")
  forgotPasswordPage() {
    return { title: "Esqueci Minha Senha" };
  }

  @Public()
  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordService.execute(forgotPasswordDto.email);
  }

  @Public()
  @Get("reset-password")
  @Render("reset-password.hbs")
  resetPasswordPage() {
    return { title: "Redefinir Senha" };
  }

  @Public()
  @Post("reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordService.execute(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}
