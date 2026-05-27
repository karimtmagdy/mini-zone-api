import { Request, Response } from "express";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { GetAllLogs } from "@/application/use-cases/activity-log/getAllLogs";


export class ActivityLogController {
  constructor(private getAllLogsUseCase: GetAllLogs) {}

  getAllLogs = catchError(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const logs = await this.getAllLogsUseCase.execute(limit);
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data: logs,
    });
  });
}
