import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsMongoId,
  IsBoolean,
} from "class-validator";
import { Expose } from "class-transformer";

export class InvitationCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  roleId!: string;
}

export class UserCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  password!: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  isTermsOfSale!: boolean;

  @IsNotEmpty()
  @IsString()
  @Expose()
  tokenHash!: string;
}
