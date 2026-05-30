import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
 import { authCtrl } from "@/infrastructure/container/auth.container";
import { LoginZod, registerUserZod } from "@/shared/schema/person.zod";

const router = Router();

router.post("/register", validate(registerUserZod, "body"), authCtrl.register);
router.post("/login", validate(LoginZod, "body"), authCtrl.login);

export default {
  path: "/auth",
  router,
};
