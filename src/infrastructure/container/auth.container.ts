import { UserRepoImpl } from "@/infrastructure/repo/UserRepoImpl";
import { SessionRepoImpl } from "@/infrastructure/repo/SessionRepoImpl";
import { RegisterUser } from "@/application/use-cases/auth/registerUser";
import { LoginUser } from "@/application/use-cases/auth/loginUser";
import { AuthController } from "@/presentation/controllers/auth/auth.controller";

import { notifyService } from "@/application/services/notify.service";
// import { recordActivityUseCase } from "./activity-log.container";

// Infrastructure
const userRepository = new UserRepoImpl();
const sessionRepository = new SessionRepoImpl();

// Application
export const registerUserUseCase = new RegisterUser(
  userRepository,
  notifyService,
);
export const loginUserUseCase = new LoginUser(
  userRepository,
  sessionRepository,
);

// Presentation
export const authCtrl = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
);
