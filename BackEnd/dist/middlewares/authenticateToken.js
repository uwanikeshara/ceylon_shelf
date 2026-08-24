"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const ApiError_1 = require("../errors/ApiError");
const User_1 = require("../models/User"); // <-- add this import
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            throw new ApiError_1.APIError(403, "Access token not found");
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    return next(new ApiError_1.APIError(403, "Access token expired"));
                }
                else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                    return next(new ApiError_1.APIError(403, "Invalid access token"));
                }
                else {
                    return next(new ApiError_1.APIError(500, "Access token error"));
                }
            }
            if (!decoded || typeof decoded === "string") {
                return next(new ApiError_1.APIError(500, "Access token payload error"));
            }
            // Get user from DB and attach to req.user
            const userId = decoded.userId;
            const user = yield User_1.UserModel.findById(userId).select("-password");
            if (!user) {
                return next(new ApiError_1.APIError(403, "User not found"));
            }
            req.user = user;
            next();
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.authenticateToken = authenticateToken;
