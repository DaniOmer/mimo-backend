import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
} from "class-validator";
import { Expose } from "class-transformer";

export class ProductVariantCreateDTO {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly priceEtx!: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly priceVat!: number;

  @IsOptional()
  @IsString()
  @Expose()
  readonly stripeId?: string;

  @IsNotEmpty()
  @IsString()
  readonly productId!: string;

  @IsNotEmpty()
  @IsString()
  readonly sizeId!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly colorId!: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly material?: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly weight!: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isLimitedEdition?: boolean;
}

export class ProductVariantUpdateDTO {
  @IsOptional()
  @IsNumber()
  @Expose()
  readonly priceEtx?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly priceVat?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly quantity?: number;

  @IsOptional()
  @IsString()
  @Expose()
  readonly stripeId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly productId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly sizeId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly colorId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly material?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly weight?: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isLimitedEdition?: boolean;
}
