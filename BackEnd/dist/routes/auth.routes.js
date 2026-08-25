"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticateToken_1 = require("./../middlewares/authenticateToken");
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authorizeRole_1 = require("../middlewares/authorizeRole");
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", auth_controller_1.signup); // POST /api/auth/signup
authRouter.post("/admin/signup", authenticateToken_1.authenticateToken, (0, authorizeRole_1.authorizeRole)("admin"), auth_controller_1.Adminsignup); // POST /api/auth/admin/signup
//admin@gmail.com   //123456
authRouter.post("/login", auth_controller_1.login);
authRouter.get("/users", authenticateToken_1.authenticateToken, (0, authorizeRole_1.authorizeRole)("admin"), auth_controller_1.getAllUsers); // GET /api/auth/users
authRouter.post("/refresh-token", auth_controller_1.refreshToken);
authRouter.post("/logout", auth_controller_1.logout);
authRouter.delete("/users/:id", authenticateToken_1.authenticateToken, (0, authorizeRole_1.authorizeRole)("admin"), auth_controller_1.deleteUser); // DELETE /api/auth/users/:id
exports.default = authRouter;
