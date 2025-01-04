import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Expose } from "class-transformer";

export class ProductFeatureCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Expose()
  readonly name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Expose()
  readonly description?: string;
}

export class ProductFeatureUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Expose()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Expose()
  readonly description?: string;
}
