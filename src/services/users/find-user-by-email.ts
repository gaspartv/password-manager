import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { PrismaService } from "../prisma/service";

@Injectable()
export class FindUserByEmail {
  constructor(private readonly prisma: PrismaService) {}

  execute(email: string) {
    const emailHash = createHash("sha256").update(email).digest("hex");

    return this.prisma.user.findUnique({ where: { email: emailHash } });
  }
}
