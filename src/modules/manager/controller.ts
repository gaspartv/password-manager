import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { CreatePasswordService } from "src/services/passwords/create-password";
import { CreatePasswordDto } from "src/services/passwords/dtos/create-password.dto";
import { FindPasswordService } from "src/services/passwords/find-password";
import { ListPasswordsService } from "src/services/passwords/list-passwords";

@Controller("manager/passwords")
export class ManagerController {
  constructor(
    private readonly listPasswordsService: ListPasswordsService,
    private readonly createPasswordService: CreatePasswordService,
    private readonly findPasswordService: FindPasswordService,
  ) {}

  @Get()
  findAll(@Req() request: any) {
    return this.listPasswordsService.execute(request.user.id);
  }

  @Post()
  create(@Body() body: CreatePasswordDto, @Req() request: any) {
    return this.createPasswordService.execute({
      ...body,
      userId: request.user.id,
      code: request.user.code,
    });
  }

  @Get(":id")
  find(@Param("id") id: string, @Req() request: any) {
    return this.findPasswordService.execute({
      id,
      userId: request.user.id,
      code: request.user.code,
    });
  }
}
