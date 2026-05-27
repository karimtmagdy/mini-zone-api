import type { Request, Response } from "express";
import mongoose from "mongoose";
import pkg from "../../package.json";
import { catchError } from "../lib/catch.error";
import { SystemService, systemService } from "../services/system.service";
import { ResponseZod } from "../schema/standred.schema";
import { SystemDto } from "../contract/system.dto";
/**
 * Design Pattern: MVC Controller
 * Purpose: Handles HTTP requests/responses and delegates business logic to the service layer.
 * Responsibilities: Request validation, response formatting, and HTTP status code management.
 */
export class SystemController {
  constructor(private systemService: SystemService) {}
  getStatus = catchError(async (_req: Request, res: Response) => {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    res.status(200).json({
      status: "success",
      data: {
        backend: "Healthy",
        database: dbStatus,
        version: `v${pkg.version}-pro`,
      },
    });
  });
  getSettings = catchError(async (_req: Request, res: Response) => {
    const settings = await this.systemService.getSettings();
    res.status(200).json({
      status: "success",
      data: settings,
    } satisfies ResponseZod<SystemDto>);
  });

  updateSettings = catchError(async (req: Request, res: Response) => {
    const settings = await this.systemService.updateSettings(req.body);
    res.status(200).json({
      status: "success",
      message: "Application settings updated successfully",
      data: settings,
    } satisfies ResponseZod<SystemDto>);
  });
}
export const systemController = new SystemController(systemService);
