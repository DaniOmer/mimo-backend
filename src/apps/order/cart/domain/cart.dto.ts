import {
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsMongoId,
  IsOptional,
} from "class-validator";

export class CartItemCreateDTO {
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

export class CartItemUpdateDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly cartId!: string;

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
