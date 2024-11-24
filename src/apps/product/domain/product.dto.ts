import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ProductCreateDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  readonly name!: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  readonly description?: string;
}
