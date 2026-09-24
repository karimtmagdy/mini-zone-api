import { Request, Response } from "express";
import { CTErr } from "@/common/lib/catch-error";
import { CategoryMapper } from "@/app/mapping/category.mapper";
import {
  ArchiveCategoryUC,
  CreateCategoryUC,
  DeleteCategoryUC,
  GetCategoryByIdUC,
  ListCategoryUC,
  RestoreCategoryUC,
  UpdateCategoryUC,
  UpdateCategoryStatusUC,
} from "@/app/use-cases/category/category.uc";

import { QueryResult } from "@/types";
import {
  TCreateCategoryEX,
  TUpdateCategoryEX,
  TUpdateCategoryStatusEX,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "../validator/category.zod";
import { categoryRepo } from "@/infra/repo/category.repo";

export class CategoryController {
  constructor(
    private createUC: CreateCategoryUC,
    private getByIdUC: GetCategoryByIdUC,
    private listUC: ListCategoryUC,
    private updateUC: UpdateCategoryUC,
    private deleteUC: DeleteCategoryUC,
    private archiveUC: ArchiveCategoryUC,
    private restoreUC: RestoreCategoryUC,
    private updateStatusUC: UpdateCategoryStatusUC,
  ) {}

  all = CTErr(
    async (
      req: Request<unknown, unknown, unknown, Partial<QueryResult>>,
      res: Response,
    ) => {
      const result = await this.listUC.execute(req.query);
      res.status(200).json({
        status: "success",
        meta: result.meta,
        data: result.data.map((e) => CategoryMapper.toRoute(e)),
      });
    },
  );

  create = CTErr(
    async (
      req: Request<unknown, unknown, TCreateCategoryEX>,
      res: Response,
    ) => {
      const validated = createCategory.parse(req.body);
      const result = await this.createUC.execute(validated);
      res.status(201).json({
        code: 201,
        status: "success",
        message: "category has been created",
        data: CategoryMapper.toRoute(result),
      });
    },
  );

  one = CTErr(async (req: Request<{ categoryId: string }>, res: Response) => {
    const { categoryId } = req.params;
    const result = await this.getByIdUC.execute(categoryId);
    res.status(200).json({
      code: 200,
      status: "success",
      data: CategoryMapper.toRoute(result),
    });
  });

  update = CTErr(
    async (
      req: Request<{ categoryId: string }, unknown, TUpdateCategoryEX>,
      res: Response,
    ) => {
      const { categoryId } = req.params;
      const validated = updateCategory.parse(req.body);
      const result = await this.updateUC.execute({
        id: categoryId,
        data: validated,
      });
      res.status(200).json({
        code: 200,
        status: "success",
        message: "category has been updated",
        data: CategoryMapper.toRoute(result),
      });
    },
  );

  archive = CTErr(
    async (req: Request<{ categoryId: string }>, res: Response) => {
      const { categoryId } = req.params;
      const result = await this.archiveUC.execute(categoryId);
      res.status(200).json({
        code: 200,
        status: "success",
        message: "category has been moved to archived",
        data: CategoryMapper.toRoute(result),
      });
    },
  );

  restore = CTErr(
    async (req: Request<{ categoryId: string }>, res: Response) => {
      const { categoryId } = req.params;
      const result = await this.restoreUC.execute(categoryId);
      res.status(200).json({
        code: 200,
        status: "success",
        message: "category has been restored (unarchived)",
        data: CategoryMapper.toRoute(result),
      });
    },
  );

  updateStatus = CTErr(
    async (
      req: Request<{ categoryId: string }, unknown, TUpdateCategoryStatusEX>,
      res: Response,
    ) => {
      const { categoryId } = req.params;
      const validated = updateCategoryStatus.parse(req.body);
      const result = await this.updateStatusUC.execute({
        id: categoryId,
        data: validated,
      });
      res.status(200).json({
        code: 200,
        status: "success",
        message: `category status has been updated to ${validated.status}`,
        data: CategoryMapper.toRoute(result),
      });
    },
  );

  remove = CTErr(
    async (req: Request<{ categoryId: string }>, res: Response) => {
      const { categoryId } = req.params;
      const result = await this.deleteUC.execute(categoryId);
      res.status(200).json({
        code: 200,
        status: "success",
        message: "category has been deleted permanently",
        data: CategoryMapper.toRoute(result),
      });
    },
  );
}

const createUC = new CreateCategoryUC(categoryRepo);
const getByIdUC = new GetCategoryByIdUC(categoryRepo);
const listUC = new ListCategoryUC(categoryRepo);
const updateUC = new UpdateCategoryUC(categoryRepo);
const deleteUC = new DeleteCategoryUC(categoryRepo);
const archiveUC = new ArchiveCategoryUC(categoryRepo);
const restoreUC = new RestoreCategoryUC(categoryRepo);
const updateStatusUC = new UpdateCategoryStatusUC(categoryRepo);

export const ctrlCategory = new CategoryController(
  createUC,
  getByIdUC,
  listUC,
  updateUC,
  deleteUC,
  archiveUC,
  restoreUC,
  updateStatusUC,
);
