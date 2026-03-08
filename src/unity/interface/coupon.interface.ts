export type CouponDto =  {
  name: string;
  expiry: Date;
  discount: number;
  isActive: boolean;
  deletedAt: Date | null;
};
