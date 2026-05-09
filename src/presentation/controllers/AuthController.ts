import { Request, Response } from "express";
import { RegisterUser } from "@/application/use-cases/RegisterUser";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { ResponseDto } from "@/_R/validation/rules/response.schema";

export class AuthController {
  constructor(private registerUser: RegisterUser) {}

  register = catchError(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const result = await this.registerUser.execute(username, email, password);

    const response: ResponseDto<any> = {
      status: "success",
      message: "registered successfully",
      data: {
        user: {
          username: result.username,
          email: result.email,
        },
      },
    };

    res.status(STATUS_CODE.CREATED).json(response);
  });
}
