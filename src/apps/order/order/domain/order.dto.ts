import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
} from "class-validator";
import { OrderStatus } from "../data-access";
import { Expose } from "class-transformer";

export class OrderItemDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly productId!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly productVariantId!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly quantity!: number;
}

export class OrderCreateFromCartDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly cartId!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly shippingAddressId!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly billingAddressId!: string;
}

export class OrderUpdateDTO {
  @IsOptional()
  @IsNumber()
  @Expose()
  readonly shippingDate?: Date;

  @IsOptional()
  @IsEnum(OrderStatus)
  @Expose()
  readonly status?: OrderStatus;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  shippingAddressId!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  billingAddressId!: string;
}
