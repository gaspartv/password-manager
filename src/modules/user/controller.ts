import { Body, Controller, Get, Post, Render } from "@nestjs/common";
import { Public } from "src/decorators/is-public";
import { ConfirmUserService } from "src/services/users/confirm-user";
import { CreateUserService } from "src/services/users/create-user";
import { ConfirmUserDto } from "./dtos/confirm-user.dto";
import { UserCreateDto } from "./dtos/user-create.dto";

@Controller("user")
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly confirmUserService: ConfirmUserService,
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
}
