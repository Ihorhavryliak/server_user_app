import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@gmail.com", description: "Email" })
  @IsString({ message: "Must be string" })
  @IsEmail({}, { message: "Not correct email" })
  readonly email: string;

  @ApiProperty({ example: "12345", description: "Password" })
  @IsString({ message: "Must be string" })
  @Length(4, 16, { message: "Not less 4 and more 16 symbols" })
  readonly password: string;

  @ApiProperty({ example: "USER", description: "User role" })
  readonly role: string[];
  @ApiProperty({ example: "USER", description: "Boss id" })
  readonly bossId: number;
}
