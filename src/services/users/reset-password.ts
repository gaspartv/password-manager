import { BadRequestException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { env } from "src/env.config";
import { PrismaService } from "../prisma/service";

@Injectable()
export class ResetPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(token: string, newPassword: string) {
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

    if (userToken.type !== "PASSWORD_RESET") {
      throw new BadRequestException("Token inválido para esta operação.");
    }

    if (new Date() > userToken.expiresAt) {
      throw new BadRequestException(
        "Token expirado. Solicite uma nova recuperação de senha.",
      );
    }

    // Atualiza a senha do usuário
    await this.prisma.user.update({
      where: { id: userToken.userId },
      data: {
        password: bcrypt.hashSync(newPassword, env.BCRYPT_HASH_SALT_ROUNDS),
      },
    });

    // Revoga o token para não ser usado novamente
    await this.prisma.userToken.update({
      where: { id: userToken.id },
      data: { revoked: true },
    });

    return {
      message: "Senha redefinida com sucesso! Você já pode fazer login.",
    };
  }
}
