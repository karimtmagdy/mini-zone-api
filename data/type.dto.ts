export type ConstantTypeActive = "active" | "inactive";
export type ConstantStatus = "archived" | ConstantTypeActive;

export type ShippingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type SubCategoryStatus = ConstantStatus;
  

export type ConstantReview = "pending" | "approved" | "rejected";
export enum ReviewStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export type ConstantAddress = "home" | "work" | "other";
export enum AddressTypeEnum {
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}
 
export type PaymentMethod = "cash" | "card" | "wallet" | "cod";
export enum PaymentMethodEnum {
  PAYPAL = "paypal",
  STRIPE = "stripe",
  COD = "cod",
  WALLET = "wallet",
}
export type ConstantPaymentProvider = "paypal" | "stripe" | "paymob";
export enum PaymentProviderEnum {
  PAYPAL = "paypal",
  STRIPE = "stripe",
  PAYMOB = "paymob",
}
export type ConstantPaymentInstrument = "visa" | "mastercard" | "amex" | "jcb";
export enum PaymentInstrumentEnum {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  JCB = "jcb",
}
export type OrderPayment = {
  method: PaymentMethodEnum;
  provider: PaymentProviderEnum;
  instrument: PaymentInstrumentEnum;
};
