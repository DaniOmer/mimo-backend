import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";
import { Expose } from "class-transformer";

export class AddressDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly firstName!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly lastName!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly streetNumber!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly street!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly city!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly postalCode!: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly state!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly country!: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isBilling!: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isShipping!: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isDefault!: boolean;
}
