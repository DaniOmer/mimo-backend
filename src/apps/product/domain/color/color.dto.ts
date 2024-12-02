import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsBoolean } from "class-validator";

export class ColorCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(7)
  @MinLength(7)
  readonly hexCode!: string;

  @IsOptional()
  @IsString()
  readonly colorGroup?: string;

  @IsOptional()
  @IsBoolean()
  readonly isTrending?: boolean;
}

export class ColorUpdateDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  @MinLength(7)
  readonly hexCode?: string;

  @IsOptional()
  @IsString()
  readonly colorGroup?: string;

  @IsOptional()
  @IsBoolean()
  readonly isTrending?: boolean;
}
