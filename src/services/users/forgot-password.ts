import { Injectable } from "@nestjs/common";
import { env } from "src/env.config";
import { NodemailerService } from "src/providers/nodemailer/nodemailer.service";
import { GenerateCodeUtil } from "src/utils/generate-code.util";
import { PrismaService } from "../prisma/service";
import { FindUserByEmail } from "./find-user-by-email";

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly findUserByEmail: FindUserByEmail,
    private readonly prisma: PrismaService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async execute(email: string) {
    const user = await this.findUserByEmail.execute(email);

    if (!user) {
      return {
        message:
          "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
      };
    }

    await this.prisma.userToken.updateMany({
      where: {
        userId: user.id,
        type: "PASSWORD_RESET",
        revoked: false,
      },
      data: { revoked: true },
    });

    let token = "";
    let userTokenExists = true;
    while (userTokenExists) {
      token = GenerateCodeUtil.execute();
      userTokenExists =
        (await this.prisma.userToken.findUnique({
          where: { token },
        })) !== null;
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await this.prisma.userToken.create({
      data: {
        userId: user.id,
        token,
        type: "PASSWORD_RESET",
        data: "",
        expiresAt,
      },
    });

    // Envia o email com o link de recuperação
    await this.nodemailerService.sendMail({
      subject: "Recuperação de Senha",
      to: email,
      text: `Clique no link para redefinir sua senha: ${env.FRONT_URL}/user/reset-password?token=${token}. Este link expira em 15 minutos.`,
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <p><a href="${env.FRONT_URL}/user/reset-password?token=${token}">Redefinir Senha</a></p>
        <p>Este link expira em 15 minutos.</p>
        <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
      `,
    });

    return {
      message:
        "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
    };
  }
}
