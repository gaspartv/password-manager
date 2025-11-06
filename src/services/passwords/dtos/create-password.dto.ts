import { IsString } from "class-validator";

export class CreatePasswordDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  url?: string;
}
