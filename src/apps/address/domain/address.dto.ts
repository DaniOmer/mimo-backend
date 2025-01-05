import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class AddressDTO {
  @IsNotEmpty()
  @IsString()
  readonly firstName!: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName!: string;

  @IsNotEmpty()
  @IsString()
  readonly streetNumber!: string;

  @IsNotEmpty()
  @IsString()
  readonly street!: string;

  @IsNotEmpty()
  @IsString()
  readonly city!: string;

  @IsNotEmpty()
  @IsString()
  readonly postalCode!: string;

  @IsOptional()
  @IsString()
  readonly state!: string;

  @IsNotEmpty()
  @IsString()
  readonly country!: string;

  @IsOptional()
  @IsBoolean()
  readonly isBilling!: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isShipping!: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isDefault!: boolean;
}
