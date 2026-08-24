"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../errors/ApiError");
const errorHandler = (error, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
        console.error("[ServerError]", error);
    }
    if (error && (error.code === 11000 || error.name === "MongoServerError")) {
        res.status(400).json({ message: "An account with this email address is already registered." });
        return;
    }
    if (error instanceof mongoose_1.default.Error) {
        res.status(400).json({ message: error.message });
        return;
    }
    if (error instanceof ApiError_1.APIError) {
        res.status(error.status).json({ message: error.message });
        return;
    }
    res.status(500).json({ message: error.message || "Internal server error" });
};
exports.errorHandler = errorHandler;
