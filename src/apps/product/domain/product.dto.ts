import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  MinLength,
} from "class-validator";

export class ProductCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  readonly basePrice?: number;

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
  @IsNumber()
  readonly basePrice?: number;

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
}
