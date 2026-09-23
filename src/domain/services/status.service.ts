import { AppError } from "@/shared/api/api-error";
import { Types } from "mongoose";
import { Archivable, Identifiable, StatusAble, Timestamped } from "@/types";

// ============================================================
// 1. STANDALONE COMPONENTS (each concern fully independent)
// ============================================================

export type StatusTransitions<TStatus extends string> = Readonly<
  Record<TStatus, readonly TStatus[]>
>;

export class StatusComponent<
  TStatus extends string,
  const TTransitions extends StatusTransitions<TStatus>,
> {
  private _status: TStatus;
  private readonly _transitions: TTransitions;

  constructor(status: TStatus, transitions: TTransitions) {
    this._status = status;
    this._transitions = transitions;
  }

  public get status(): TStatus {
    return this._status;
  }

  public transition(to: TStatus): void {
    const allowed = this._transitions[this._status];
    if (!allowed || !allowed.includes(to)) {
      throw new AppError(
        `Invalid transition from ${this._status} to ${to}`,
        400,
      );
    }
    this._status = to;
  }
}

export class TimestampComponent {
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(createdAt: Date, updatedAt: Date) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ArchiveComponent {
  isArchived: boolean;
  archivedAt: Date | null;

  constructor(isArchived: boolean = false, archivedAt: Date | null = null) {
    this.isArchived = isArchived;
    this.archivedAt = archivedAt;
  }

  public archive(): void {
    this.isArchived = true;
    this.archivedAt = new Date();
  }

  public unarchive(): void {
    this.isArchived = false;
    this.archivedAt = null;
  }
}

export class IdComponent {
  public readonly _id: Types.ObjectId | string;

  constructor(id: Types.ObjectId | string) {
    this._id = id;
  }

  public get id(): string {
    return this._id.toString();
  }
}

// ============================================================
// 2. REUSABLE BASE - write boilerplate ONCE, inherit everywhere
// ============================================================

export interface AggregateRootInit<
  TStatus extends string,
  TTransitions extends StatusTransitions<TStatus>,
> {
  id: string;
  status: TStatus;
  transitions: TTransitions;
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
  archivedAt?: Date | null;
}

export abstract class AggregateRoot<
  TStatus extends string,
  const TTransitions extends StatusTransitions<TStatus>,
>
  implements Identifiable, Timestamped, Archivable, StatusAble<TStatus>
{
  private readonly _idComp: IdComponent;
  private readonly _timestampComp: TimestampComponent;
  private readonly _archiveComp: ArchiveComponent;
  private readonly _statusComp: StatusComponent<TStatus, TTransitions>;

  protected constructor(init: AggregateRootInit<TStatus, TTransitions>) {
    this._idComp = new IdComponent(init.id);
    this._timestampComp = new TimestampComponent(
      init.createdAt,
      init.updatedAt,
    );
    this._archiveComp = new ArchiveComponent(
      init.isArchived ?? false,
      init.archivedAt ?? null,
    );
    this._statusComp = new StatusComponent(init.status, init.transitions);
  }

  // --- Id ---
  public get _id() {
    return this._idComp._id;
  }
  public get id(): string {
    return this._idComp.id;
  }

  // --- Timestamps ---
  public get createdAt(): Date {
    return this._timestampComp.createdAt;
  }
  public get updatedAt(): Date {
    return this._timestampComp.updatedAt;
  }

  // --- Archive ---
  public get isArchived(): boolean {
    return this._archiveComp.isArchived;
  }
  public set isArchived(value: boolean) {
    this._archiveComp.isArchived = value;
  }
  public get archivedAt(): Date | null {
    return this._archiveComp.archivedAt;
  }
  public set archivedAt(value: Date | null) {
    this._archiveComp.archivedAt = value;
  }
  public archive(): void {
    this._archiveComp.archive();
  }
  public unarchive(): void {
    this._archiveComp.unarchive();
  }

  // --- Status ---
  public get status(): TStatus {
    return this._statusComp.status;
  }
  public transition(to: TStatus): void {
    this._statusComp.transition(to);
  }
}
