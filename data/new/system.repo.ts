import { System } from "../models/system.model";
import type { SystemDto } from "../contract/system.dto";

/**
 * Design Pattern: Repository Pattern
 * Purpose: Abstracts data access logic and provides a collection-like interface for domain objects.
 * Responsibilities: Handles all database operations (CRUD) and shields the service layer from data access details.
 */
export class SystemRepo {
  async getSettings(): Promise<SystemDto> {
    let settings = await System.findOne({ id: "app-settings" });
    if (!settings) {
      settings = await System.create({ id: "app-settings" });
    }
    return settings.toObject() as SystemDto;
  }
  async updateSettings(data: Partial<SystemDto>): Promise<SystemDto> {
    const settings = await System.findOneAndUpdate(
      { id: "app-settings" },
      { $set: data },
      { new: true, upsert: true, runValidators: true },
    );
    return settings.toObject() as SystemDto;
  }
}

export const systemRepo = new SystemRepo();
