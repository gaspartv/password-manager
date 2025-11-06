import { Injectable } from "@nestjs/common";
import { deriveKey, encrypt } from "src/utils/crypt.util";
import { PrismaService } from "../prisma/service";
import { CreatePasswordDto } from "./dtos/create-password.dto";

@Injectable()
export class CreatePasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreatePasswordDto & { userId: string; code: string }) {
    console.log({
      code: dto.code,
      userId: dto.userId,
    });

    const key = await deriveKey(dto.code, dto.userId);

    const { data, iv } = await encrypt(dto.password, key);

    await this.prisma.password.create({
      data: {
        name: dto.name,
        passwordEnc: data,
        passwordIv: iv,
        url: dto.url,
        userId: dto.userId,
      },
    });

    return {
      message: "Senha salva com sucesso.",
    };
  }
}
