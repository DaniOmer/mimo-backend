import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsMongoId,
  IsOptional,
} from "class-validator";

export class OrderItemCreateDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly order!: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly product!: string;

  @IsOptional()
  @IsMongoId()
  readonly productVariant?: string | null;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly quantity!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly priceEtx!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly priceVat!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly subTotalEtx!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly subTotalVat!: number;
}
