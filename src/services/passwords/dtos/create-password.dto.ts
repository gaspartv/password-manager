import { IsOptional, IsString } from "class-validator";

export class CreatePasswordDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  url?: string;
}
