import { Router } from "express";
import { ctrlAuth } from "../controller/auth.controller";

const router = Router();
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

export default {
  path: "/auth",
  router,
};
