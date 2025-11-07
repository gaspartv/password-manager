import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/service";

@Injectable()
export class ListPasswordsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, search?: string) {
    const trimmed = search?.trim();
    const where: Prisma.PasswordWhereInput = trimmed
      ? {
          userId,
          OR: [
            { name: { contains: trimmed, mode: "insensitive" } },
            { url: { contains: trimmed, mode: "insensitive" } },
          ],
        }
      : { userId };

    return this.prisma.password.findMany({
      where,
      select: {
        id: true,
        name: true,
        url: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
