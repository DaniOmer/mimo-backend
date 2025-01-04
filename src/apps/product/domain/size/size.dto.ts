import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  MaxLength,
  MinLength,
} from "class-validator";
import { Expose } from "class-transformer";

export class SizeCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Expose()
  readonly name!: string;

  @IsString()
  @MaxLength(50)
  @MinLength(5)
  @Expose()
  readonly dimensions!: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly volume?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly weightCapacity?: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isPopular?: boolean;
}

export class SizeUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Expose()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly dimensions?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly volume?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  readonly weightCapacity?: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isPopular?: boolean;
}
