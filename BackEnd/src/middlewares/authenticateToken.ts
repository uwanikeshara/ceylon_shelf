import jwt, { JsonWebTokenError, TokenExpiredError, JwtPayload } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { APIError } from "../errors/ApiError"
import { UserModel } from "../models/User" // <-- add this import

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      throw new APIError(403, "Access token not found")
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key", async (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return next(new APIError(403, "Access token expired"));
        } else if (err instanceof JsonWebTokenError) {
          return next(new APIError(403, "Invalid access token"));
        } else {
          return next(new APIError(500, "Access token error"));
        }
      }

      if (!decoded || typeof decoded === "string") {
        return next(new APIError(500, "Access token payload error"));
      }

      // Get user from DB and attach to req.user
      const userId = (decoded as JwtPayload).userId;
      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
        return next(new APIError(403, "User not found"));
      }
      (req as any).user = user;

      next();
    });
  } catch (error) {
    next(error);
  }
};