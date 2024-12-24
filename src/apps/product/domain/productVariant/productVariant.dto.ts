import { IsNotEmpty, IsOptional, IsNumber, IsString, IsBoolean } from "class-validator";

export class ProductVariantCreateDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly priceEtx!: number;

  @IsNotEmpty()
  @IsNumber()
  readonly priceVat!: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity!: number;

  @IsOptional()
  @IsString()
  readonly stripeId?: string;

  @IsNotEmpty()
  @IsString()
  readonly productId!: string;

  @IsNotEmpty()
  @IsString()
  readonly sizeId!: string;

  @IsNotEmpty()
  @IsString()
  readonly colorId!: string;

  @IsOptional()
  @IsString()
  readonly material?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly weight!: number;

  @IsOptional()
  @IsBoolean()
  readonly isLimitedEdition?: boolean;
}

export class ProductVariantUpdateDTO {
  @IsOptional()
  @IsNumber()
  readonly priceEtx?: number;

  @IsOptional()
  @IsNumber()
  readonly priceVat?: number;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;

  @IsOptional()
  @IsString()
  readonly stripeId?: string;

  @IsOptional()
  @IsString()
  readonly productId?: string;

  @IsOptional()
  @IsString()
  readonly sizeId?: string;

  @IsOptional()
  @IsString()
  readonly colorId?: string;

  @IsOptional()
  @IsString()
  readonly material?: string;

  @IsOptional()
  @IsNumber()
  readonly weight?: number;

  @IsOptional()
  @IsBoolean()
  readonly isLimitedEdition?: boolean;
}
