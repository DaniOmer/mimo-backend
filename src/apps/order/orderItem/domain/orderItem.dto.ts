import { IsNotEmpty, IsNumber, IsPositive, IsMongoId } from "class-validator";
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
  readonly subtotal!: number;
}
