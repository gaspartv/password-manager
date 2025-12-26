import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/service";

@Injectable()
export class ConfirmUserService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(token: string) {
    const userToken = await this.prisma.userToken.findUnique({
      where: { token },
      include: { User: true },
    });

    if (!userToken) {
      throw new BadRequestException("Token inválido ou não encontrado.");
    }

    if (userToken.revoked) {
      throw new BadRequestException("Este token já foi utilizado.");
    }

    if (userToken.type !== "NEW_USER") {
      throw new BadRequestException("Token inválido para esta operação.");
    }

    if (new Date() > userToken.expiresAt) {
      throw new BadRequestException(
        "Token expirado. Solicite um novo registro.",
      );
    }

    await this.prisma.user.update({
      where: { id: userToken.userId },
      data: { emailVerifiedAt: new Date() },
    });

    await this.prisma.userToken.update({
      where: { id: userToken.id },
      data: { revoked: true },
    });

    return {
      message:
        "Seu cadastro foi confirmado com sucesso! Você já pode fazer login.",
    };
  }
}
