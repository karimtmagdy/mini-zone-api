import { AppError } from "@/shared/utils/api.error";
import { isValidTransition } from "@/shared/utils/state-machine";

export interface StatusRepository<T, S extends string> {
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>, performerId?: string): Promise<T | null>;
}

/**
 * Reusable StatusService for managing state transitions on any entity.
 */
export class StatusService<T extends { status?: S }, S extends string> {
  constructor(
    private readonly repo: StatusRepository<T, S>,
    private readonly transitions: Record<S, readonly S[]>,
  ) {}

  /**
   * Validates if a transition from currentStatus to newStatus is allowed.
   */
  public canTransition(currentStatus: S, newStatus: S): boolean {
    return isValidTransition(this.transitions, currentStatus, newStatus);
  }

  /**
   * Fetches the entity, validates the status transition, and applies the update.
   */
  public async changeStatus(
    id: string,
    newStatus: S,
    performerId?: string,
  ): Promise<T> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw AppError.notFound("Entity not found");
    }

    const currentStatus = entity.status;
    if (!currentStatus) {
      throw AppError.badRequest("Entity has no current status defined");
    }

    if (!this.canTransition(currentStatus, newStatus)) {
      throw AppError.badRequest(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    const updated = await this.repo.update(
      id,
      { status: newStatus } as Partial<T>,
      performerId,
    );
    if (!updated) {
      throw AppError.internal("Failed to update status");
    }

    return updated;
  }
}
