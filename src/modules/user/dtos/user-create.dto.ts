import { IsEmail, IsString } from "class-validator";

export class UserCreateDto {
  @IsString({ message: "Formato de nome inválido." })
  name: string;

  @IsEmail({}, { message: "Formato de e-mail inválido." })
  email: string;

  @IsString({ message: "Formato de senha inválido." })
  password: string;
}
