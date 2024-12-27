import {
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsMongoId,
  IsOptional,
} from "class-validator";

export class CartItemDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly productId!: string;

  @IsOptional()
  @IsMongoId()
  readonly productVariantId!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly quantity!: number;
}
