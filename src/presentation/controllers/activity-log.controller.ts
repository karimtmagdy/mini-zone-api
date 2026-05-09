import { Request, Response } from "express";
import { activityLogService } from "@/_R/services/activity-log.service";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";

export class ActivityLogController {
  getAllLogs = catchError(async (req: Request, res: Response) => {
    const logs = await activityLogService.getAll();
    res.status(STATUS_CODE.OK).json({
      status: "success",
      data: logs,
    });
  });
}

export const activityLogController = new ActivityLogController();
