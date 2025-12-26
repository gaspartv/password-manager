import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmUserDto {
  @IsString()
  @IsNotEmpty({ message: "O token é obrigatório." })
  token: string;
}
