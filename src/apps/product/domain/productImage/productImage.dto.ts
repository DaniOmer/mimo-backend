import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class ProductImageCreateDTO {
  @IsNotEmpty()
  @IsString()
  readonly productId!: string;

  @IsNotEmpty()
  @IsString()
  readonly url!: string;

  @IsOptional()
  @IsBoolean()
  readonly isPrimary?: boolean;

  @IsOptional()
  @IsString()
  readonly altText?: string;

  @IsOptional()
  @IsString()
  readonly resolution?: string;

  @IsOptional()
  @IsString()
  readonly type?: string;

  @IsOptional()
  @IsNumber()
  readonly order?: number;
}


export class ProductImageUpdateDTO {
  @IsOptional()
  @IsString()
  readonly url?: string;

  @IsOptional()
  @IsBoolean()
  readonly isPrimary?: boolean;

  @IsOptional()
  @IsString()
  readonly altText?: string;

  @IsOptional()
  @IsString()
  readonly resolution?: string;

  @IsOptional()
  @IsString()
  readonly type?: string;

  @IsOptional()
  @IsNumber()
  readonly order?: number;
}

