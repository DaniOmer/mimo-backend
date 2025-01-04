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

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly createdBy!: string;

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
  @IsString()
  @Expose()
  readonly updatedBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  readonly priceEtx!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  readonly priceVat!: number;
}
