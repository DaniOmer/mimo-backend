import {
  IsNotEmpty,
  IsPositive,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";
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

export class CartCreateDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  readonly items!: CartItemDTO[];
}
