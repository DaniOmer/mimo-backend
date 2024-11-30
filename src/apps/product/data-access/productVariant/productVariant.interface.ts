import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductVariant extends Document, Timestamps {
  _id: string;
  price_etx: number; // Prix hors taxes
  price_vat: number; // Prix TTC
  quantity: number; // Quantité disponible
  stripe_id?: string; // Identifiant Stripe
  product_id: Types.ObjectId; // Référence au produit
  size_id: Types.ObjectId; // Référence à la taille
  color_id: Types.ObjectId; // Référence à la couleur
  material?: string; // Matériau utilisé
  weight: number; // Poids en grammes
  isLimitedEdition?: boolean; // Indique si c'est une édition limitée
}

