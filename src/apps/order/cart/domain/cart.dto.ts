import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, Min, IsMongoId } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "mongoose";

class CartItemDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly orderItemId!: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price!: number;
}

export class CartCreateDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly userId!: Schema.Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  readonly items!: CartItemDTO[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly totalPrice!: number;
}