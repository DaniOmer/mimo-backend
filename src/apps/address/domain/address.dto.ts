import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from "class-validator";
import { AddressType, AddressStatus } from "../data-access";

export class AddressDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly streetNumber!: number;

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

  @IsNotEmpty()
  @IsEnum(AddressType)
  readonly type!: AddressType;

  @IsNotEmpty()
  @IsEnum(AddressStatus)
  readonly status!: AddressStatus;
}
