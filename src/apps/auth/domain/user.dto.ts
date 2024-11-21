import {
  MinLength,
  MaxLength,
  IsAlpha,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsUrl,
  IsOptional,
} from "class-validator";

import { Role } from "../data-access/user.interface";

export class UserCreateDTO {
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(50)
  readonly firstName!: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(50)
  readonly lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  readonly password!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(250)
  readonly avatar?: string;

  @IsEnum(Role)
  readonly role!: Role;

  @IsBoolean()
  readonly isTermsOfSale!: boolean;
}
