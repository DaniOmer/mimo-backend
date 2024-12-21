import { IsNotEmpty, IsOptional, IsString, IsMongoId, MaxLength, MinLength } from "class-validator";

export class CategoryCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  readonly name!: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsMongoId()
  @IsString()
  readonly parentId?: string;
}

export class CategoryUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  readonly parentId?: string;
}
