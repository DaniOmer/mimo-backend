import {
  MinLength,
  MaxLength,
  IsAlpha,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsUrl,
  IsOptional,
  Matches,
  IsString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { IRole } from "../../data-access";

import { Expose } from "class-transformer";

export class UserRegisterDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Za-z\s]+$/, {
    message: "firstName must contain only letters and spaces",
  })
  @Expose()
  readonly firstName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Za-z\s]+$/, {
    message: "lastName must contain only letters and spaces",
  })
  @Expose()
  readonly lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email!: string;

  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^,:;&+*-]).{12,}$/
  )
  @Expose()
  readonly password!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(250)
  @Expose()
  readonly avatar?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isTermsOfSale!: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isDefaultPreference!: boolean;
}

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email!: string;

  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^,:;&+*-]).{12,}$/
  )
  @Expose()
  readonly password!: string;
}

export class UserUpdateDTO {

  @IsOptional()
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(50)
  @Expose()
  readonly firstName!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(50)
  @Expose()
  readonly lastName!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(250)
  @Expose()
  readonly avatar?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Expose()
  readonly roles?: IRole[];
}

export class RequestPasswordResetDTO {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email!: string;
}

export class ConfirmPasswordResetDTO {
  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^,:;&+*-]).{12,}$/
  )
  @Expose()
  readonly password!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly token!: string;
}

export class ConfirmEmailDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly token!: string;
}

export class PasswordUpdateDTO {
  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^,:;&+*-]).{12,}$/
  )
  @Expose()
  readonly oldPassword!: string;

  @IsNotEmpty()
  @MinLength(12, { message: "Password must be at least 12 characters long" })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^,:;&+*-]).{12,}$/
  )
  @Expose()
  readonly newPassword!: string;
}
