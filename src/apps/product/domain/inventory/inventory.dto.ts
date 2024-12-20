import {
  IsAlpha,
  IsMongoId,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class AddProductInventoryDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly productId!: string;

  @IsOptional()
  @IsMongoId()
  readonly productVariantId!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity!: number;

  @IsNotEmpty()
  @IsAlpha()
  readonly warehouseId!: string;
}

export class UpdateProductInventoryDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly quantity!: number;
}
