import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: "O token é obrigatório." })
  token: string;

  @IsString({ message: "Formato de senha inválido." })
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres." })
  password: string;
}
