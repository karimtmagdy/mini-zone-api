import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import { authCtrl } from "@/infrastructure/container/auth.container";
import { LoginZod, registerUserZod } from "@/shared/schema/person.zod";
import { authenticated } from "@/presentation/middlewares/authorized";

const router = Router();

router.post("/register", validate(registerUserZod, "body"), authCtrl.register);
router.post("/login", validate(LoginZod, "body"), authCtrl.login);
router.get("/account", authenticated, authCtrl.account);

export default {
  path: "/auth",
  router,
};
