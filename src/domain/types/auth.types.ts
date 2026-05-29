import { LoginDTO, RegisterDTO } from "@/presentation/validation/auth.zod";

 

export interface AuthRepoType {
  register(): Promise<RegisterDTO>;
  login(): Promise<LoginDTO>;
  logout(): Promise<any>;
  refresh(): Promise<any>;
  revoked(): Promise<any>;
  logoutAll(): Promise<any>;
  changePassword(): Promise<any>;
  resetPassword(): Promise<any>;
  forgotPassword(): Promise<any>;
}
