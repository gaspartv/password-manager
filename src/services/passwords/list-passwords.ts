import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/service";

@Injectable()
export class ListPasswordsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.password.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });
  }
}
