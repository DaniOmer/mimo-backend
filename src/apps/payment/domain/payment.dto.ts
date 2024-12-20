import "reflect-metadata";
import {
  IsAlpha,
  IsMongoId,
  IsAlphanumeric,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from "class-validator";

export class PaymentMethodDTO {
  @IsMongoId()
  readonly customer!: string;

  @IsNotEmpty()
  @IsAlpha()
  readonly provider!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  readonly providerPaymentMethodId!: string;

  @IsOptional()
  @IsBoolean()
  readonly isDefault?: boolean;
}

export class CardMethodDTO extends PaymentMethodDTO {
  @IsNotEmpty()
  @IsAlpha()
  readonly brand!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  readonly last4!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expMonth!: number;

  @IsNotEmpty()
  @IsNumber()
  readonly expYear!: number;
}

export class PayPalMethodDTO extends PaymentMethodDTO {
  @IsNotEmpty()
  @IsAlpha()
  readonly email!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  readonly payerId!: string;
}