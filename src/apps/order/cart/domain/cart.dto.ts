import {
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsMongoId,
  IsOptional,
} from "class-validator";
import { Expose } from "class-transformer";

export class CartItemCreateDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly productId!: string;

  @IsOptional()
  @IsMongoId()
  @Expose()
  readonly productVariantId!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly quantity!: number;
}

export class CartItemUpdateDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly cartId!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly productId!: string;

  @IsOptional()
  @IsMongoId()
  @Expose()
  readonly productVariantId!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly quantity!: number;
}
