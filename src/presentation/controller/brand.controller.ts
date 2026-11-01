import { Request, Response } from "express";
import { CTErr } from "@/common/lib/catch-error";
import { BrandMapper } from "@/app/mapping/brand.mapper";
import { brandRepo } from "@/infra/repo/brand.repo";
import {
  ArchiveBrandUC,
  CreateBrandUC,
  DeleteBrandUC,
  GetBrandByIdUC,
  ListBrandsUC,
  RestoreBrandUC,
  UpdateBrandStatusUC,
  UpdateBrandUC,
} from "@/app/use-cases/brand/brand.uc";
import {
  TCreateBrandEX,
  TUpdateBrandEX,
  TUpdateBrandStatusEX,
  createBrand,
  updateBrand,
  updateBrandStatus,
} from "@/presentation/validator/brand.zod";
import { QueryResult } from "@/types";

export class BrandController {
  constructor(
    private createUC: CreateBrandUC,
    private getByIdUC: GetBrandByIdUC,
    private listUC: ListBrandsUC,
    private updateUC: UpdateBrandUC,
    private deleteUC: DeleteBrandUC,
    private archiveUC: ArchiveBrandUC,
    private restoreUC: RestoreBrandUC,
    private updateStatusUC: UpdateBrandStatusUC,
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
        data: result.data.map((e) => BrandMapper.toRoute(e)),
      });
    },
  );

  create = CTErr(
    async (req: Request<unknown, unknown, TCreateBrandEX>, res: Response) => {
      const validated = createBrand.parse(req.body);
      const result = await this.createUC.execute(validated);
      res.status(201).json({
        code: 201,
        status: "success",
        message: "brand has been created",
        data: BrandMapper.toRoute(result),
      });
    },
  );

  one = CTErr(async (req: Request<{ brandId: string }>, res: Response) => {
    const { brandId } = req.params;
    const result = await this.getByIdUC.execute(brandId);
    res.status(200).json({
      code: 200,
      status: "success",
      data: BrandMapper.toRoute(result),
    });
  });

  update = CTErr(
    async (
      req: Request<{ brandId: string }, unknown, TUpdateBrandEX>,
      res: Response,
    ) => {
      const { brandId } = req.params;
      const validated = updateBrand.parse(req.body);
      const result = await this.updateUC.execute({
        id: brandId,
        data: validated,
      });
      res.status(200).json({
        code: 200,
        status: "success",
        message: "brand has been updated",
        data: BrandMapper.toRoute(result),
      });
    },
  );

  archive = CTErr(async (req: Request<{ brandId: string }>, res: Response) => {
    const { brandId } = req.params;
    const result = await this.archiveUC.execute(brandId);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "brand has been moved to archived",
      data: BrandMapper.toRoute(result),
    });
  });

  restore = CTErr(async (req: Request<{ brandId: string }>, res: Response) => {
    const { brandId } = req.params;
    const result = await this.restoreUC.execute(brandId);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "brand has been restored (unarchived)",
      data: BrandMapper.toRoute(result),
    });
  });

  updateStatus = CTErr(
    async (
      req: Request<{ brandId: string }, unknown, TUpdateBrandStatusEX>,
      res: Response,
    ) => {
      const { brandId } = req.params;
      const validated = updateBrandStatus.parse(req.body);
      const result = await this.updateStatusUC.execute({
        id: brandId,
        data: validated,
      });
      res.status(200).json({
        code: 200,
        status: "success",
        message: `brand status has been updated to ${validated.status}`,
        data: BrandMapper.toRoute(result),
      });
    },
  );

  remove = CTErr(async (req: Request<{ brandId: string }>, res: Response) => {
    const { brandId } = req.params;
    const result = await this.deleteUC.execute(brandId);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "brand has been deleted permanently",
      data: BrandMapper.toRoute(result),
    });
  });
}

export const ctrlBrand = new BrandController(
  new CreateBrandUC(brandRepo),
  new GetBrandByIdUC(brandRepo),
  new ListBrandsUC(brandRepo),
  new UpdateBrandUC(brandRepo),
  new DeleteBrandUC(brandRepo),
  new ArchiveBrandUC(brandRepo),
  new RestoreBrandUC(brandRepo),
  new UpdateBrandStatusUC(brandRepo),
);
