import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/service";

@Injectable()
export class FindUserByEmail {
  constructor(private readonly prisma: PrismaService) {}

  execute(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
