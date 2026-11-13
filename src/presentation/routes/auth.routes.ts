import { Router } from "express";
import { ctrlAuth } from "../controller/auth.controller";
import { authenticated } from "@/common/middleware/authorize-middleware";

const router = Router();
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
router.post("/refresh", ctrlAuth.refresh);
router.post("/logout", authenticated, ctrlAuth.logout);
router.get("/me", authenticated, ctrlAuth.getCurrentAccount);

export default {
  path: "/auth",
  router,
};
