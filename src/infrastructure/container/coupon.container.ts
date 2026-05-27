import { CouponRepoImpl } from "../repo/CouponRepoImpl";
import { CreateCoupon } from "@/application/use-cases/coupons/createCoupon";
import { GetAllCoupons } from "@/application/use-cases/coupons/getAllCoupons";
import { GetCouponById } from "@/application/use-cases/coupons/getCouponById";
import { UpdateCoupon } from "@/application/use-cases/coupons/updateCoupon";
import { DeleteCoupon } from "@/application/use-cases/coupons/deleteCoupon";
import { ApplyCoupon } from "@/application/use-cases/coupons/applyCoupon";
import { GenerateBulkCoupons } from "@/application/use-cases/coupons/generateBulkCoupons";
import { DeleteBulkCoupons } from "@/application/use-cases/coupons/deleteBulkCoupons";
import { CouponController } from "@/presentation/controllers/coupon.controller";

// Infrastructure
const couponRepository = new CouponRepoImpl();

// Application
export const createCouponUseCase = new CreateCoupon(couponRepository);
export const getAllCouponsUseCase = new GetAllCoupons(couponRepository);
export const getCouponByIdUseCase = new GetCouponById(couponRepository);
export const updateCouponUseCase = new UpdateCoupon(couponRepository);
export const deleteCouponUseCase = new DeleteCoupon(couponRepository);
export const applyCouponUseCase = new ApplyCoupon(couponRepository);
export const generateBulkCouponsUseCase = new GenerateBulkCoupons(couponRepository);
export const deleteBulkCouponsUseCase = new DeleteBulkCoupons(couponRepository);

// Presentation
export const couponCtrl = new CouponController(
  createCouponUseCase,
  getAllCouponsUseCase,
  getCouponByIdUseCase,
  updateCouponUseCase,
  deleteCouponUseCase,
  applyCouponUseCase,
  generateBulkCouponsUseCase,
  deleteBulkCouponsUseCase,
);
