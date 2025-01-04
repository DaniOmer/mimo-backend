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
import { Expose } from "class-transformer";
export class AddProductInventoryDTO {
  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly product!: string;

  @IsOptional()
  @IsMongoId()
  @Expose()
  readonly productVariant!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  readonly quantity!: number;

  @IsNotEmpty()
  @IsMongoId()
  @Expose()
  readonly warehouse!: string;
}

export class UpdateProductInventoryDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  readonly quantity!: number;
}

export class GetLowQuantityProductsDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(2)
  @Max(10)
  @Expose()
  readonly threshold!: number;
}
