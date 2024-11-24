import { IsNotEmpty, MaxLength, MinLength, IsString } from "class-validator";

export class ProductCreateDTO {
  @IsNotEmpty()
  @IsString() 
  @MinLength(3)
  @MaxLength(255)
  readonly name!: string;

  @IsNotEmpty()
  @IsString() 
  @MinLength(10)
  @MaxLength(1000)
  readonly description?: string;
}
