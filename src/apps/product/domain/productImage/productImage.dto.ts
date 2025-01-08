import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { Expose } from "class-transformer";

export class ProductImageCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly productId!: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly url!: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isPrimary?: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  readonly altText?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly resolution?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly type?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly order?: number;
}

export class ProductImageUpdateDTO {
  @IsOptional()
  @IsString()
  @Expose()
  readonly url?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isPrimary?: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  readonly altText?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly resolution?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly type?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly order?: number;
}
