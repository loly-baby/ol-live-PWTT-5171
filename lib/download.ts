import { ProductType } from "@prisma/client";
import { PRODUCT_PRICING } from "@/lib/pricing";

export function getFormatsForProduct(productType: ProductType) {
  return PRODUCT_PRICING[productType].formats;
}
