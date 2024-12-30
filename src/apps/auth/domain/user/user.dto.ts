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
  IsString,
  IsArray,
} from "class-validator";

import { AuthType } from "../../data-access";

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
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)
  readonly password!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(250)
  readonly avatar?: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  roles!: string[];

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
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)
  readonly password!: string;
}

export class UserUpdateDTO {
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

  @IsOptional()
  @IsUrl()
  @MaxLength(250)
  readonly avatar?: string;
}

export class RequestPasswordResetDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;
}

export class ConfirmPasswordResetDTO {
  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/)
  readonly password!: string;

  @IsNotEmpty()
  @IsString()
  readonly token!: string;
}

export class ConfirmEmailDTO {
  @IsNotEmpty()
  @IsString()
  readonly token!: string;
}
