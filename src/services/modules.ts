import { Global, Module } from "@nestjs/common";
import { CreatePasswordService } from "./passwords/create-password";
import { FindPasswordService } from "./passwords/find-password";
import { ListPasswordsService } from "./passwords/list-passwords";
import { PrismaService } from "./prisma/service";
import { ConfirmUserService } from "./users/confirm-user";
import { CreateUserService } from "./users/create-user";
import { FindUserByEmail } from "./users/find-user-by-email";
import { FindUserById } from "./users/find-user-by-id";

@Global()
@Module({
  providers: [
    // Users
    ConfirmUserService,
    CreateUserService,
    FindUserById,
    FindUserByEmail,

    // Passwords
    CreatePasswordService,
    FindPasswordService,
    ListPasswordsService,

    // Prisma
    PrismaService,
  ],
  exports: [
    // Users
    ConfirmUserService,
    CreateUserService,
    FindUserById,
    FindUserByEmail,

    // Passwords
    CreatePasswordService,
    FindPasswordService,
    ListPasswordsService,

    // Prisma
    PrismaService,
  ],
})
export class ServicesModule {}
