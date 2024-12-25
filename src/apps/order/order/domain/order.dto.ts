import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  IsPositive,
  ValidateNested,
  IsArray,
  ArrayMinSize,
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
  readonly productId!: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly productVariantId!: ObjectId;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly quantity!: number;
}

export class OrderCreateDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly shippingAddressId!: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly billingAddressId!: ObjectId;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  readonly orderItems!: OrderItemDTO[];
}
