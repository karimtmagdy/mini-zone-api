import { systemRepo, type SystemRepo } from "../repo/system.repo";
import type { SystemDto } from "../contract/system.dto";

/**
 * Design Pattern: Service Layer
 * Purpose: Business logic layer that orchestrates operations between controllers and repositories.
 * Responsibilities: Handles complex business rules, data transformation, and coordinates multiple repositories if needed.
 */
export class SystemService {
  constructor(private systemRepo: SystemRepo) {}
  async getSettings(): Promise<SystemDto> {
    return await this.systemRepo.getSettings();
  }
  async updateSettings(data: Partial<SystemDto>): Promise<SystemDto> {
    return await this.systemRepo.updateSettings(data);
  }
}

export const systemService = new SystemService(systemRepo);
