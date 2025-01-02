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

export class ProductDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly name!: string;


  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly priceEtx?: number;

  @IsOptional()
  @IsNumber()
  readonly priceVat?: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly isActive!: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly images?: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly categoryIds!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly featureIds?: string[];

  @IsNotEmpty()
  @IsString()
  readonly createdBy!: string;

  @IsOptional()
  @IsString()
  readonly updatedBy?: string;
}

export class ProductUpdateDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly featureIds?: string[];

  @IsOptional()
  @IsString()
  readonly updatedBy?: string;


  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly priceEtx!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly priceVat!: number;
}
