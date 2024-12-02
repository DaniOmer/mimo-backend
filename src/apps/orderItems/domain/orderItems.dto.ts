import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";
import 'reflect-metadata';
import { Schema } from "mongoose";

export class OrderItemCreateDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly order_id!: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly productVariant_id!: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  readonly quantity!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  readonly priceEtx!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  readonly priceVat!: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  readonly subtotal!: number;
}