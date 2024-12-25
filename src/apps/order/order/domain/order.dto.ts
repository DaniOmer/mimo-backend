import { IsNotEmpty, IsMongoId, IsNumber, IsPositive } from "class-validator";

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
