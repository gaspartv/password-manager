import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma/service";
import { FindUserByEmail } from "./users/find-user-by-email";
import { FindUserById } from "./users/find-user-by-id";

@Global()
@Module({
  providers: [
    // Users
    FindUserById,
    FindUserByEmail,

    PrismaService,
  ],
  exports: [
    // Users
    FindUserById,
    FindUserByEmail,

    PrismaService,
  ],
})
export class ServicesModule {}
