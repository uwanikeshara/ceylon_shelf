import { Request, Response, NextFunction } from "express";
import { APIError } from "../errors/ApiError";

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== role) {
      return next(new APIError(403, "Forbidden: Insufficient permissions"));
    }
    next();
  };
};