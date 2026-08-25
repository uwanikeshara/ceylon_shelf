import { authenticateToken } from './../middlewares/authenticateToken';
import { Router } from "express"
import { signup, Adminsignup, getAllUsers, login, refreshToken, logout, deleteUser } from "../controllers/auth.controller"
import { authorizeRole } from '../middlewares/authorizeRole';

const authRouter = Router()

authRouter.post("/signup", signup) // POST /api/auth/signup
authRouter.post("/admin/signup",  authenticateToken, authorizeRole("admin"), Adminsignup) // POST /api/auth/admin/signup
//admin@gmail.com   //123456
authRouter.post("/login", login)
authRouter.get("/users", authenticateToken, authorizeRole("admin"), getAllUsers) // GET /api/auth/users
authRouter.post("/refresh-token", refreshToken)
authRouter.post("/logout", logout)
authRouter.delete("/users/:id", authenticateToken, authorizeRole("admin"), deleteUser) // DELETE /api/auth/users/:id
export default authRouter
