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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.deleteUser = exports.getAllUsers = exports.Adminsignup = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const Reader_1 = require("../models/Reader");
const ApiError_1 = require("../errors/ApiError");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const createAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key_12345", { expiresIn: "24h" });
};
const createRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key_12345", { expiresIn: "7d" });
};
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password, role } = req.body;
        if (!name || !name.trim()) {
            throw new ApiError_1.APIError(400, "Name is required");
        }
        if (!email || !email.trim()) {
            throw new ApiError_1.APIError(400, "Email is required");
        }
        if (!password || password.length < 6) {
            throw new ApiError_1.APIError(400, "Password must be at least 6 characters");
        }
        const cleanEmail = email.toLowerCase().trim();
        const existingUser = yield User_1.UserModel.findOne({ email: cleanEmail });
        if (existingUser) {
            throw new ApiError_1.APIError(400, "An account with this email address is already registered");
        }
        const userRole = role === "admin" ? "admin" : "user";
        const SALT = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT);
        const user = new User_1.UserModel({
            email: cleanEmail,
            name: name.trim(),
            password: hashedPassword,
            role: userRole,
        });
        yield user.save();
        if (userRole === "user") {
            const existingReader = yield Reader_1.ReaderModel.findOne({ email: cleanEmail });
            if (!existingReader) {
                yield Reader_1.ReaderModel.create({
                    name: name.trim(),
                    email: cleanEmail,
                    phoneNumber: "+94 77 123 4567",
                    address: "Colombo Branch",
                    registerDate: new Date(),
                });
            }
        }
        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        const userPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        };
        res.status(201).json(userPayload);
    }
    catch (err) {
        next(err);
    }
});
exports.signup = signup;
const Adminsignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        if (!name || !email || !password) {
            throw new ApiError_1.APIError(400, "All fields are required");
        }
        const cleanEmail = email.toLowerCase().trim();
        const SALT = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT);
        const user = new User_1.UserModel({
            email: cleanEmail,
            name: name.trim(),
            role: "admin",
            password: hashedPassword,
        });
        yield user.save();
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        res.status(201).json(userWithoutPassword);
    }
    catch (err) {
        next(err);
    }
});
exports.Adminsignup = Adminsignup;
const getAllUsers = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.UserModel.find().select("-password");
        res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.UserModel.findByIdAndDelete(userId);
        if (!user) {
            throw new ApiError_1.APIError(404, "User not found");
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !email.trim() || !password) {
            throw new ApiError_1.APIError(400, "Email and password are required");
        }
        const cleanEmail = email.toLowerCase().trim();
        const user = yield User_1.UserModel.findOne({ email: cleanEmail });
        if (!user) {
            throw new ApiError_1.APIError(400, "Invalid email or password");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError_1.APIError(400, "Invalid email or password");
        }
        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        const userPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        };
        res.status(200).json(userPayload);
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token) {
            throw new ApiError_1.APIError(401, "Refresh token missing");
        }
        jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key_12345", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    return next(new ApiError_1.APIError(401, "Refresh token expired"));
                }
                else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                    return next(new ApiError_1.APIError(401, "Invalid refresh token"));
                }
                else {
                    return next(new ApiError_1.APIError(401, "Refresh token error"));
                }
            }
            if (!decoded || typeof decoded === "string") {
                return next(new ApiError_1.APIError(401, "Refresh token payload error"));
            }
            const userId = decoded.userId;
            const user = yield User_1.UserModel.findById(userId);
            if (!user) {
                return next(new ApiError_1.APIError(401, "User not found"));
            }
            const newAccessToken = createAccessToken(user._id.toString());
            res.status(200).json({ accessToken: newAccessToken, role: user.role });
        }));
    }
    catch (err) {
        next(err);
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res, next) => {
    try {
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            expires: new Date(0),
            path: "/",
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
