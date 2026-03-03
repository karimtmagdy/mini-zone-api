import { Router } from "express";
import { EmployeeController } from "../../controller/employee.controller.js";
import { EmployeeService } from "../../service/employee.service.js";
import { EmployeeRepo } from "../../repo/employee.repo.js";
import { validate } from "../../middlewares/validate.js";
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
  EmployeeQuerySchema,
} from "../../validation/employee.schema.js";

const router = Router();
const repo = new EmployeeRepo();
const service = new EmployeeService(repo);
const employeeCtrl = new EmployeeController(service);

router.post("/", validate(CreateEmployeeSchema), employeeCtrl.create);

router.get("/", validate(EmployeeQuerySchema, "query"), employeeCtrl.getAll);

router.get("/:id", employeeCtrl.getById);

router.patch("/:id", validate(UpdateEmployeeSchema), employeeCtrl.update);

router.delete("/:id", employeeCtrl.deactivate);

export default router;
