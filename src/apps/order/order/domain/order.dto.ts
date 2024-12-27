import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
} from "class-validator";
import { OrderStatus } from "../data-access";

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
  readonly cartId!: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly shippingAddressId!: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly billingAddressId!: string;
}

export class OrderUpdateDTO {
  @IsOptional()
  @IsNumber()
  readonly shippingDate?: Date;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;

  @IsNotEmpty()
  @IsMongoId()
  shippingAddressId!: string;

  @IsNotEmpty()
  @IsMongoId()
  billingAddressId!: string;
}
