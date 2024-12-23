import { IsString, IsEmail, IsNotEmpty, IsMongoId, IsBoolean } from "class-validator";

export class InvitationCreateDTO {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsMongoId()
  roleId!: string;
}

export class UserCreateDTO {
  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsBoolean()
  isTermsOfSale!: boolean;
}