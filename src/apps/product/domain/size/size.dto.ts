import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, MaxLength, MinLength } from "class-validator";

export class SizeCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name!: string;

  @IsString()
  @MaxLength(50)
  @MinLength(5)
  readonly dimensions!: string;

  @IsOptional()
  @IsNumber()
  readonly volume?: number;

  @IsOptional()
  @IsNumber()
  readonly weightCapacity?: number;

  @IsOptional()
  @IsBoolean()
  readonly isPopular?: boolean;
}

export class SizeUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly dimensions?: string;

  @IsOptional()
  @IsNumber()
  readonly volume?: number;

  @IsOptional()
  @IsNumber()
  readonly weightCapacity?: number;

  @IsOptional()
  @IsBoolean()
  readonly isPopular?: boolean;
}
