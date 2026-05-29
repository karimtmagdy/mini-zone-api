import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  changePasswordZod,
  forogtPasswordZod,
  loginWith2FAZod,
  verify2FAZod,
  resetPasswordZod,
  refreshTokenZod,
} from "@/_R/auth.schema";
import { authCtrl } from "@/_R/auth.controller";
import { profileCtrl } from "@/_R/profile.controller";
import { authenticated } from "@/presentation/middlewares/authorized";

const router = Router();

router.get("/profile", authenticated, profileCtrl.getProfile);
// // --- Session Management ---
router.post("/session/logout", authenticated, authCtrl.logout);
router.post(
  "/session/refresh",
  authenticated,
  validate(refreshTokenZod),
  authCtrl.refresh,
);
router.post(
  "/session/logout-devices",
  authenticated,
  authCtrl.logoutOtherDevices,
);

// // --- Email Verification ---
router.get("/verify-email/:token", authCtrl.verifyEmail);

// // --- Password Management ---
router.post(
  "/forgot-password",
  validate(forogtPasswordZod, "body"),
  authCtrl.forgotPassword,
);
//  "/reset-password/:token",
router.post(
  "/reset-password",
  validate(resetPasswordZod, "body"),
  authCtrl.resetPassword,
);

router.post(
  "/change-password",
  authenticated,
  validate(changePasswordZod, "body"),
  authCtrl.changePassword,
);

// // --- Two-Factor Authentication (2FA) ---

router.post("/2fa/setup", authenticated, authCtrl.setup2FA);
router.post(
  "/2fa/enable",
  authenticated,
  validate(verify2FAZod, "body"),
  authCtrl.enable2FA,
);
router.post(
  "/2fa/disable",
  authenticated,
  validate(verify2FAZod, "body"),
  authCtrl.disable2FA,
);
router.post(
  "/2fa/verify",
  validate(loginWith2FAZod, "body"),
  authCtrl.verify2FALogin,
);
