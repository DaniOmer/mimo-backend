import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsMongoId,
} from "class-validator";
import { Expose } from "class-transformer";

export class ProductDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Expose()
  readonly name!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @Expose()
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  readonly priceEtx?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly priceVat?: number;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  readonly isActive!: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly hasVariants?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly images?: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly categoryIds!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly featureIds?: string[];

  @IsOptional()
  @IsString()
  @Expose()
  readonly updatedBy?: string;
}

export class ProductUpdateDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Expose()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly featureIds?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  readonly priceEtx?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  readonly priceVat?: number;
}

export class ProductFilterDto {
  @IsOptional()
  @IsMongoId()
  @Expose()
  productId?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Expose()
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Expose()
  featureIds?: string[];

  @IsOptional()
  @IsNumber()
  @Expose()
  min_price?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  max_price?: number;

  @IsOptional()
  @IsString()
  @Expose()
  size?: string;

  @IsOptional()
  @IsString()
  @Expose()
  color?: string;
}
