import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import { registerUserZod, LoginZod } from "@/presentation/validation/auth.zod";
import { authCtrl } from "@/infrastructure/container/auth.container";

const router = Router();

router.post("/register", validate(registerUserZod, "body"), authCtrl.register);
router.post("/login", validate(LoginZod, "body"), authCtrl.login);

export default {
  path: "/auth",
  router,
};
