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
  Matches,
} from "class-validator";

import { Role } from "../data-access/user.interface";

export class UserRegisterDTO {
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
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  readonly password!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(250)
  readonly avatar?: string;

  @IsOptional()
  @IsEnum(Role)
  readonly role!: Role;

  @IsOptional()
  @IsBoolean()
  readonly isTermsOfSale!: boolean;
}

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches("/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*W)(?!.* ).{8,16}$/")
  readonly password!: string;
}
