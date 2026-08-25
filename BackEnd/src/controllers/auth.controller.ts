import bcrypt from "bcrypt"
import { Request, Response, NextFunction } from "express"
import { UserModel } from "../models/User"
import { ReaderModel } from "../models/Reader"
import { APIError } from "../errors/ApiError"
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken"

const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || "default_access_secret_key_12345", { expiresIn: "24h" })
}

const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key_12345", { expiresIn: "7d" })
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, role } = req.body;
    if (!name || !name.trim()) {
      throw new APIError(400, "Name is required");
    }
    if (!email || !email.trim()) {
      throw new APIError(400, "Email is required");
    }
    if (!password || password.length < 6) {
      throw new APIError(400, "Password must be at least 6 characters");
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: cleanEmail });
    if (existingUser) {
      throw new APIError(400, "An account with this email address is already registered");
    }

    const userRole = role === "admin" ? "admin" : "user";
    const SALT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new UserModel({
      email: cleanEmail,
      name: name.trim(),
      password: hashedPassword,
      role: userRole,
    });
    await user.save();

    if (userRole === "user") {
      const existingReader = await ReaderModel.findOne({ email: cleanEmail });
      if (!existingReader) {
        await ReaderModel.create({
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
  } catch (err) {
    next(err);
  }
};

export const Adminsignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body;
    if (!name || !email || !password) {
      throw new APIError(400, "All fields are required");
    }
    const cleanEmail = email.toLowerCase().trim();
    const SALT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new UserModel({
      email: cleanEmail,
      name: name.trim(),
      role: "admin",
      password: hashedPassword,
    });
    await user.save();
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new APIError(404, "User not found");
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !email.trim() || !password) {
      throw new APIError(400, "Email and password are required");
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: cleanEmail });
    if (!user) {
      throw new APIError(400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new APIError(400, "Invalid email or password");
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
  } catch (err: any) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new APIError(401, "Refresh token missing");
    }

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key_12345",
      async (err: Error | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            return next(new APIError(401, "Refresh token expired"));
          } else if (err instanceof JsonWebTokenError) {
            return next(new APIError(401, "Invalid refresh token"));
          } else {
            return next(new APIError(401, "Refresh token error"));
          }
        }

        if (!decoded || typeof decoded === "string") {
          return next(new APIError(401, "Refresh token payload error"));
        }

        const userId = (decoded as JwtPayload).userId as string;
        const user = await UserModel.findById(userId);

        if (!user) {
          return next(new APIError(401, "User not found"));
        }

        const newAccessToken = createAccessToken(user._id.toString());
        res.status(200).json({ accessToken: newAccessToken, role: user.role });
      }
    );
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    next(err);
  }
};
