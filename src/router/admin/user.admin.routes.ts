import { Router } from "express";
import { UserController } from "../../controller/user.controller.js";
import { EmployeeRepo } from "../../repo/employee.repo.js";
import { UserService } from "../../service/user.service.js";
import { UserRepo } from "../../repo/user.repo.js";
import { validate } from "../../middlewares/validate.js";
import {
  IdParamZod,
//   MultipleBulkDeleteZod,
} from "../../validation/shard.schema.js";
import { createUserZod, updateUserZod } from "../../validation/user.schema.js";

const router = Router();
const repo = new UserRepo();
const employeeRepo = new EmployeeRepo();
const service = new UserService(repo, employeeRepo);
const userCtrl = new UserController(service);

router.get("/", userCtrl.getAll);
router.post("/", validate(createUserZod), userCtrl.create);

router.get("/:id", validate(IdParamZod, "params"), userCtrl.getOne);
router.patch("/:id", validate(updateUserZod), userCtrl.updateUserByAdmin);
router.patch(
  "/deactivate/:id",
  validate(IdParamZod, "params"),
  userCtrl.deactivateByAdmin,
);

// router.delete("/bulk", validate(MultipleBulkDeleteZod), userCtrl.deleteBulk);

export default router;
