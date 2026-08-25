import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import { APIError } from "../errors/ApiError"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("[ServerError]", error);
  }

  if (error && (error.code === 11000 || error.name === "MongoServerError")) {
    res.status(400).json({ message: "An account with this email address is already registered." });
    return;
  }

  if (error instanceof mongoose.Error) {
    res.status(400).json({ message: error.message })
    return
  }

  if (error instanceof APIError) {
    res.status(error.status).json({ message: error.message })
    return
  }

  res.status(500).json({ message: error.message || "Internal server error" })
}
