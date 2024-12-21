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
  readonly product!: string;

  @IsOptional()
  @IsMongoId()
  readonly productVariant!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity!: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly warehouse!: string;
}

export class UpdateProductInventoryDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly quantity!: number;
}
