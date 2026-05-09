import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import { registerUserZod } from "@/_R/validation/person/auth.schema";
import { authCtrl } from "../../infrastructure/container/user.container";

const router = Router();

router.post("/register", validate(registerUserZod, "body"), authCtrl.register);

export default router;
