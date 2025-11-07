import { Injectable } from "@nestjs/common";
import { deriveKey, encrypt } from "src/utils/crypt.util";
import { PrismaService } from "../prisma/service";
import { CreatePasswordDto } from "./dtos/create-password.dto";

@Injectable()
export class CreatePasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreatePasswordDto & { userId: string; code: string }) {
    const key = await deriveKey(dto.code, dto.userId);

    const encryptedPassword = await encrypt(dto.password, key);
    const encryptedLogin = await encrypt(dto.login, key);

    await this.prisma.password.create({
      data: {
        name: dto.name,
        loginEnc: encryptedLogin.data,
        loginIv: encryptedLogin.iv,
        passwordEnc: encryptedPassword.data,
        passwordIv: encryptedPassword.iv,
        url: dto.url,
        userId: dto.userId,
      },
    });

    return {
      message: "Senha salva com sucesso.",
    };
  }
}
