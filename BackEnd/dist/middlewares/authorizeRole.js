"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const ApiError_1 = require("../errors/ApiError");
const authorizeRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || user.role !== role) {
            return next(new ApiError_1.APIError(403, "Forbidden: Insufficient permissions"));
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
