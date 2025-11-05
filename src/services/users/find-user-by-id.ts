import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/service";

@Injectable()
export class FindUserById {
  constructor(private readonly prisma: PrismaService) {}

  execute(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
