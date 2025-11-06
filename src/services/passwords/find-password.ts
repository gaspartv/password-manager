import { Injectable, NotFoundException } from "@nestjs/common";
import { decrypt, deriveKey } from "src/utils/crypt.util";
import { PrismaService } from "../prisma/service";

@Injectable()
export class FindPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: { id: string; code: string; userId: string }) {
    const password = await this.prisma.password.findUnique({
      where: { id: dto.id },
      select: { passwordEnc: true, passwordIv: true },
    });
    if (!password) {
      throw new NotFoundException("Senha não encontrada.");
    }

    console.log({
      code: dto.code,
      userId: dto.userId,
    });

    const key = await deriveKey(dto.code, dto.userId);

    const decrypted = await decrypt(
      password.passwordEnc,
      password.passwordIv,
      key,
    );

    return { password: decrypted };
  }
}
