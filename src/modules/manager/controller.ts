import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
} from "@nestjs/common";
import { Public } from "src/decorators/is-public";
import { CreatePasswordService } from "src/services/passwords/create-password";
import { CreatePasswordDto } from "src/services/passwords/dtos/create-password.dto";
import { FindPasswordService } from "src/services/passwords/find-password";
import { ListPasswordsService } from "src/services/passwords/list-passwords";

@Controller("manager")
export class ManagerController {
  constructor(
    private readonly listPasswordsService: ListPasswordsService,
    private readonly createPasswordService: CreatePasswordService,
    private readonly findPasswordService: FindPasswordService,
  ) {}

  @Public()
  @Get()
  @Render("passwords.hbs")
  passwordsPage() {
    return { title: "Gerenciador de Senhas" };
  }

  @Get("passwords")
  findAll(@Req() request: any, @Query("search") search: string) {
    return this.listPasswordsService.execute(request.user.id, search);
  }

  @Post("passwords")
  create(@Body() body: CreatePasswordDto, @Req() request: any) {
    return this.createPasswordService.execute({
      ...body,
      userId: request.user.id,
      code: request.user.code,
    });
  }

  @Get("passwords/:id")
  find(@Param("id") id: string, @Req() request: any) {
    return this.findPasswordService.execute({
      id,
      userId: request.user.id,
      code: request.user.code,
    });
  }

  @Get("passwords/:id/login")
  async getLogin(@Param("id") id: string, @Req() request: any) {
    const result = await this.findPasswordService.execute({
      id,
      userId: request.user.id,
      code: request.user.code,
    });
    return { login: result.login };
  }

  @Get("passwords/:id/password")
  async getPassword(@Param("id") id: string, @Req() request: any) {
    const result = await this.findPasswordService.execute({
      id,
      userId: request.user.id,
      code: request.user.code,
    });
    return { password: result.password };
  }
}
