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

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly priceVat?: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly productId!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly sizeId!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly colorId!: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly material?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly weight?: number;

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

export class ProductVariantUpdateDTOWithId extends ProductVariantCreateDTO {
  @IsOptional()
  @IsString()
  readonly _id?: string;
}
