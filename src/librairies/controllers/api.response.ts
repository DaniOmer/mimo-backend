import { Request, Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    message: string,
    data: any = {},
    status = 200
  ): void {
    res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static successWithToken(
    res: Response,
    message: string,
    data: any,
    token: string,
    status = 200
  ): void {
    res.status(status).json({
      success: true,
      message,
      token,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    code = 400,
    details: any = null
  ): void {
    res.status(code).json({
      success: false,
      message,
      error: {
        code,
        details,
      },
    });
  }
}
