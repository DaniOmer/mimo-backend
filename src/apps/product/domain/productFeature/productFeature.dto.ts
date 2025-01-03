import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class ProductFeatureCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly description?: string;
}

export class ProductFeatureUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly description?: string;
}
