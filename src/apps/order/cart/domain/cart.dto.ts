import { IsNotEmpty, IsPositive, IsNumber, IsMongoId } from "class-validator";
import { ObjectId } from "mongoose";

export class CartItemDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly productId!: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly productVariantId!: ObjectId;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  readonly quantity!: number;
}
