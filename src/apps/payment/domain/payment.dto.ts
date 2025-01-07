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
import { Expose } from "class-transformer";

import { PaymentCurrencyType } from "../../../config/store";

export class PaymentMethodDTO {
  @IsNotEmpty()
  @Expose()
  readonly customer!: string;

  @IsNotEmpty()
  @IsAlpha()
  @Expose()
  readonly provider!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Expose()
  readonly providerPaymentMethodId!: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly isDefault?: boolean;
}

export class CardMethodDTO extends PaymentMethodDTO {
  @IsNotEmpty()
  @IsAlpha()
  @Expose()
  readonly brand!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Expose()
  readonly last4!: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly expMonth!: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readonly expYear!: number;
}

export class CardPaymentIntentDTO {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  amount!: number;

  @IsNotEmpty()
  @Expose()
  @IsEnum(PaymentCurrencyType)
  currency!: PaymentCurrencyType;

  @IsNotEmpty()
  @Expose()
  readonly paymentMethod!: string;
}

export class PayPalMethodDTO extends PaymentMethodDTO {
  @IsNotEmpty()
  @IsAlpha()
  @Expose()
  readonly email!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Expose()
  readonly payerId!: string;
}
