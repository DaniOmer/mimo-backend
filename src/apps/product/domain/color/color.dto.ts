import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
} from "class-validator";
import { Expose } from "class-transformer";

export class ColorCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Expose()
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(7)
  @MinLength(7)
  @Expose()
  readonly hexCode!: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly colorGroup?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isTrending?: boolean;
}

export class ColorUpdateDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Expose()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  @MinLength(7)
  @Expose()
  readonly hexCode?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readonly colorGroup?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isTrending?: boolean;
}
