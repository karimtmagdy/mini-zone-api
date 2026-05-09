import { UserRepoImpl } from "@/infrastructure/repo/UserRepoImpl";
import { RegisterUser } from "@/application/use-cases/RegisterUser";
import { AuthController } from "@/presentation/controllers/AuthController";

// Infrastructure
const userRepository = new UserRepoImpl();

// Application
export const registerUserUseCase = new RegisterUser(userRepository);

// Presentation
export const authCtrl = new AuthController(registerUserUseCase);
