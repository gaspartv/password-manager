import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto {
  @IsEmail({}, { message: "Formato de e-mail inválido." })
  email: string;

  @IsString({ message: "Formato de senha inválido." })
  @MinLength(1, { message: "Formato de senha inválido." })
  password: string;
}
