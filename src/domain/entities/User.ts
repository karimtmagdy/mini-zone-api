import { Person } from "./Person";

// export class User extends Person {
//   // public employeeId?: string;
//   // constructor(data: Partial<User>) {
//   //   // super(data);
//   //    Object.assign(this, data);
//   //   // if (data.employeeId) this.employeeId = data.employeeId;
//   // }
// }
export class User extends Person {
  constructor(data: Partial<User>) {
    super(data)
    Object.assign(this, data);
  }
}
