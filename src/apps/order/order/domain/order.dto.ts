import { IsNotEmpty, IsString, IsDate, IsEnum, IsOptional, MaxLength, MinLength, IsMongoId, IsNumber, IsPositive, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "../data-access/order.interface";
import 'reflect-metadata';
import { Schema } from "mongoose";

class AddressDTO {
  @IsNotEmpty()
  @IsString()
  readonly street!: string;

  @IsNotEmpty()
  @IsString()
  readonly city!: string;

  @IsNotEmpty()
  @IsString()
  readonly state!: string;

  @IsNotEmpty()
  @IsString()
  readonly postalCode!: string;

  @IsNotEmpty()
  @IsString()
  readonly country!: string;
}

export class OrderCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly orderNumber!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly orderDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  shipDate?: Date;

  @IsNotEmpty()
  @IsEnum(OrderStatus, { message: `Status must be one of: ${Object.values(OrderStatus).join(", ")}` })
  status!: OrderStatus;

  @IsNotEmpty()
  @IsMongoId()
  readonly user_id!: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  readonly priceEtx!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  readonly priceVat!: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDTO)
  readonly shippingAddress!: AddressDTO;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDTO)
  readonly billingAddress!: AddressDTO;
}