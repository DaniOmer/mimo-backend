import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsMongoId,
  IsOptional,
} from "class-validator";
import { Expose } from "class-transformer";

export class OrderItemCreateDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly order!: string;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly product!: string;

  @IsOptional()
  @IsMongoId()
  @Expose()
  readonly productVariant?: string | null;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly quantity!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly priceEtx!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly priceVat!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly subTotalEtx!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Expose()
  readonly subTotalVat!: number;
}
