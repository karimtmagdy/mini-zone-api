import { ActivityLogRepoImpl } from "../repo/ActivityLogRepoImpl";
// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { GetAllLogs } from "@/application/use-cases/activity-log/getAllLogs";
import { ActivityLogController } from "@/presentation/controllers/activity-log.controller";

const activityLogRepo = new ActivityLogRepoImpl();

// export const recordActivityUseCase = new RecordActivity(activityLogRepo);
export const getAllLogsUseCase = new GetAllLogs(activityLogRepo);

export const activityLogCtrl = new ActivityLogController(getAllLogsUseCase);

// For backwards compatibility with the legacy activityLogService.record
export const activityLogService = {
  // record: (data: any) => recordActivityUseCase.execute(data),
  getAll: (limit?: number) => getAllLogsUseCase.execute(limit),
};
