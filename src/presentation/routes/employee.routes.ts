import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  createEmployeeZod,
  updateEmployeeZod,
} from "@/shared/schema/person.zod";
import { employeeCtrl } from "@/infrastructure/container/employee.container";
import { IdParamZod } from "@/shared/schema/shard.schema";
import { authenticated } from "@/presentation/middlewares/authorized";

const router = Router();

router.use(authenticated);

router
  .route("/")
  .get(employeeCtrl.getAll)
  .post(validate(createEmployeeZod, "body"), employeeCtrl.create);

router.get("/archived", employeeCtrl.getDeleted);
router.get("/department/:department", employeeCtrl.getByDepartment);
router.get("/manager/:managerId", employeeCtrl.getByManager);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), employeeCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    validate(updateEmployeeZod, "body"),
    employeeCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), employeeCtrl.soft);

router.patch(
  "/restore/:id",
  validate(IdParamZod, "params"),
  employeeCtrl.restore,
);

export default {
  path: "/employees",
  router,
};
