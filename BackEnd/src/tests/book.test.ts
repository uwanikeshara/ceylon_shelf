import request from "supertest";
import { app } from "../index";
import mongoose from "mongoose";
import { connectDB } from "../db/mongo";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

describe("Book Controller API Integration Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_secret_key_123";
    await connectDB();

    const adminUser = await UserModel.findOne({ role: "admin" });
    if (adminUser) {
      authToken = jwt.sign({ userId: adminUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should retrieve a list of books when authenticated", async () => {
    const res = await request(app)
      .get("/api/book")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new book item when authenticated", async () => {
    const res = await request(app)
      .post("/api/book")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "The Village in the Jungle",
        author: "Leonard Woolf",
        genre: "Sri Lankan Literature",
        availableCopies: 3,
        publishedDate: "1913-01-01",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("The Village in the Jungle");
  });
});
