import { BadRequestException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { createHash } from "crypto";
import cuid from "cuid";
import { env } from "src/env.config";
import { UserCreateDto } from "src/modules/user/dtos/user-create.dto";
import { NodemailerService } from "src/providers/nodemailer/nodemailer.service";
import { deriveKey, encrypt } from "src/utils/crypt.util";
import { GenerateCodeUtil } from "src/utils/generate-code.util";
import { PrismaService } from "../prisma/service";
import { FindUserByEmail } from "./find-user-by-email";

@Injectable()
export class CreateUserService {
  constructor(
    private readonly findUserByEmail: FindUserByEmail,
    private readonly prisma: PrismaService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async execute(dto: UserCreateDto) {
    const emailExists = await this.findUserByEmail.execute(dto.email);
    if (emailExists) {
      throw new BadRequestException("Email já cadastrado.");
    }

    const salt = cuid();
    const key = await deriveKey(env.CRYPT_KEY, salt);

    const { data, iv } = await encrypt(env.ADMIN_EMAIL, key);

    const newUser = {
      name: dto.name,
      email: createHash("sha256").update(dto.email).digest("hex"),
      emailEnc: data,
      emailIv: iv,
      password: bcrypt.hashSync(dto.password, env.BCRYPT_HASH_SALT_ROUNDS),
    };

    const userCreate = await this.prisma.user.create({ data: newUser });

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

    const userToken = await this.prisma.userToken.create({
      data: {
        userId: userCreate.id,
        token,
        type: "NEW_USER",
        data: bcrypt.hashSync(dto.password, 10),
        expiresAt,
      },
    });

    await this.nodemailerService.sendMail({
      subject: "Alteração de senha",
      to: dto.email,
      text: `Clique no link para confirmar seu cadastro ${env.FRONT_URL}/user/confirm-register?token=${token}`,
      html: `<p>Clique no link para confirmar seu cadastro <a href="${env.FRONT_URL}/user/confirm-register?token=${token}">${env.FRONT_URL}/confirm-register?token=${token}</a></p>`,
    });

    return {
      message: "Código enviado para seu e-mail.",
      user_token_id: userToken.id,
    };
  }
}
