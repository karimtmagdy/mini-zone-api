import { Router } from "express";
import { ctrlAuth } from "../controller/auth.controller";
import { authenticated } from "@/common/middleware/authorize-middleware";
import { limiter } from "@/infra/config/rate-limit";

const router = Router();
router.post("/register", ctrlAuth.register);
router.post("/login", limiter, ctrlAuth.login);
router.post("/refresh", ctrlAuth.refresh);
router.post("/logout", authenticated, ctrlAuth.logout);
router.get("/me", authenticated, ctrlAuth.getCurrentAccount);
// router.post("/reset-password", ctrlAuth.resetPassword);
// router.post("/change-password", ctrlAuth.changePassword);
// router.post("/reset-password-confirm", ctrlAuth.resetPasswordConfirm);

export default {
  path: "/auth",
  router,
};
