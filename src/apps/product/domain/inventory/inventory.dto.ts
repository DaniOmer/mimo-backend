import {
  IsAlpha,
  IsMongoId,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
  Max,
} from "class-validator";

export class AddProductInventoryDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly product!: string;

  @IsOptional()
  @IsMongoId()
  readonly productVariant!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly quantity!: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly warehouse!: string;
}

export class UpdateProductInventoryDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly quantity!: number;
}

export class GetLowQuantityProductsDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(2)
  @Max(10)
  readonly threshold!: number;
}
