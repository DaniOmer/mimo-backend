import { IsNotEmpty, IsPositive, IsNumber, IsMongoId } from "class-validator";

export class CartItemDTO {
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
