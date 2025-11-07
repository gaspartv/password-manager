import { Injectable, NotFoundException } from "@nestjs/common";
import { decrypt, deriveKey } from "src/utils/crypt.util";
import { PrismaService } from "../prisma/service";

@Injectable()
export class FindPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: { id: string; code: string; userId: string }) {
    const password = await this.prisma.password.findUnique({
      where: { id: dto.id, userId: dto.userId },
      select: {
        name: true,
        loginEnc: true,
        loginIv: true,
        passwordEnc: true,
        passwordIv: true,
        url: true,
      },
    });
    if (!password) {
      throw new NotFoundException("Senha não encontrada.");
    }

    const key = await deriveKey(dto.code, dto.userId);

    const decryptedPassword = await decrypt(
      password.passwordEnc,
      password.passwordIv,
      key,
    );

    const decryptedLogin = await decrypt(
      password.loginEnc,
      password.loginIv,
      key,
    );

    return {
      name: password.name,
      login: decryptedLogin,
      password: decryptedPassword,
      url: password.url,
    };
  }
}
