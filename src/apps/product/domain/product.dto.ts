import {
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
  @MaxLength(255)
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly priceEtx!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly priceVat!: number;
}
