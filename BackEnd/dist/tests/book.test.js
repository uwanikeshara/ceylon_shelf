"use strict";
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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_1 = require("../db/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
describe("Book Controller API Integration Tests", () => {
    let authToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = "test";
        process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_secret_key_123";
        yield (0, mongo_1.connectDB)();
        const adminUser = yield User_1.UserModel.findOne({ role: "admin" });
        if (adminUser) {
            authToken = jsonwebtoken_1.default.sign({ userId: adminUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it("should retrieve a list of books when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get("/api/book")
            .set("Authorization", `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it("should create a new book item when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
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
    }));
});
