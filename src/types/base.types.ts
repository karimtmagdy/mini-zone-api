import { Document } from "mongoose";
import { IBaseDate, Image } from "./global.types.js";

export interface IBase extends Document, IBaseDate {
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone?: string;
  image: Image;
}
