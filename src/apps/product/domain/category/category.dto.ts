import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
} from "class-validator";
import { Expose } from "class-transformer";

export class CategoryCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  @Expose()
  readonly name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly description?: string;

  @IsOptional()
  @IsMongoId()
  @IsString()
  @Expose()
  readonly parentId?: string;
}

export class CategoryUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  @Expose()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly description?: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  @Expose()
  readonly parentId?: string;
}
