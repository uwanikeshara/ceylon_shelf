import request from "supertest";
import { app } from "../index";
import mongoose from "mongoose";
import { connectDB } from "../db/mongo";

describe("Auth Controller Unit & Integration Tests", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_secret_key_123";
    process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "test_refresh_secret_123";
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user successfully via signup endpoint", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Kasun Perera",
      email: `kasun_${Date.now()}@ceylonshelf.lk`,
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email");
  });

  it("should return error when signing up with missing fields", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "invalid@ceylonshelf.lk",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
