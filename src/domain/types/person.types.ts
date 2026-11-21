import { IBaseImage } from "@/types";

export const PERSON_STATE = ["online", "offline"] as const;
export type TPersonState = (typeof PERSON_STATE)[number];
export const PERSON_GENDER = ["male", "female"] as const;
export type TPersonGender = (typeof PERSON_GENDER)[number];

export interface IPersonFields {
  state: TPersonState;
  age: number;
  gender: TPersonGender;
  image: IBaseImage;
  slug: string;
  lockedUntil: Date;
  failedLoginAttempts: number;
  lastLoginAt: Date;
}
