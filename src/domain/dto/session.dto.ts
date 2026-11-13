import { Types } from "mongoose";
import { IBaseMetaData } from "@/types";
import { ISessionFields } from "@/domain/types/session.types";

export type SessionDoc = IBaseMetaData &
  Omit<ISessionFields, "userId"> & { userId: Types.ObjectId };
