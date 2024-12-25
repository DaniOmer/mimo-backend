import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  IsPositive,
} from "class-validator";

import { ObjectId } from "mongoose";

export class AddressDTO {
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

export class OrderItemDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly productId!: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly productVariantId!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly quantity!: number;
}

export class OrderCreateFromCartDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly cartId!: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly shippingAddressId!: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly billingAddressId!: string;
}
