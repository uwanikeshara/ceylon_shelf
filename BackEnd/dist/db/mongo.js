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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const User_1 = require("../models/User");
const Book_1 = require("../models/Book");
const Reader_1 = require("../models/Reader");
const bcrypt_1 = __importDefault(require("bcrypt"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        return;
    }
    if (process.env.NODE_ENV === "test") {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield mongoose_1.default.connect(uri);
        yield seedInitialData();
        return;
    }
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ceylonshelf_db";
        console.log(`Connecting to MongoDB at: ${mongoUri}`);
        yield mongoose_1.default.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log("Connected to MongoDB database server successfully.");
    }
    catch (error) {
        console.warn("Local MongoDB connection failed. Starting in-memory MongoDB fallback...");
        try {
            const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
            const uri = mongod.getUri();
            yield mongoose_1.default.connect(uri);
            console.log(`Connected to MongoMemoryServer (In-Memory DB) at: ${uri}`);
        }
        catch (memErr) {
            console.error("Failed to start in-memory MongoDB:", memErr);
            process.exit(1);
        }
    }
    yield seedInitialData();
});
exports.connectDB = connectDB;
const seedInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash("admin123", 10);
        const adminEmail = "admin@ceylonshelf.lk";
        const existingAdmin = yield User_1.UserModel.findOne({ email: adminEmail });
        if (!existingAdmin) {
            yield User_1.UserModel.create({
                name: "Kavinda Perera (Admin)",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
        }
        else {
            existingAdmin.name = "Kavinda Perera (Admin)";
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";
            yield existingAdmin.save();
        }
        const genericBook = yield Book_1.BookModel.findOne({ title: "The Great Gatsby" });
        if (genericBook) {
            yield Book_1.BookModel.deleteMany({ title: { $in: ["The Great Gatsby", "To Kill a Mockingbird", "1984"] } });
        }
        const bookCount = yield Book_1.BookModel.countDocuments();
        if (bookCount === 0) {
            yield Book_1.BookModel.insertMany([
                {
                    title: "Madol Doova",
                    author: "Martin Wickramasinghe",
                    genre: "Classic Fiction",
                    availableCopies: 6,
                    publishedDate: new Date("1947-01-01"),
                },
                {
                    title: "Gamperaliya",
                    author: "Martin Wickramasinghe",
                    genre: "Novel",
                    availableCopies: 4,
                    publishedDate: new Date("1944-01-01"),
                },
                {
                    title: "The Seven Moons of Maali Almeida",
                    author: "Shehan Karunatilaka",
                    genre: "Magical Realism",
                    availableCopies: 3,
                    publishedDate: new Date("2022-08-04"),
                },
                {
                    title: "Chinaman: The Legend of Pradeep Mathew",
                    author: "Shehan Karunatilaka",
                    genre: "Sports Fiction",
                    availableCopies: 5,
                    publishedDate: new Date("2010-02-15"),
                },
                {
                    title: "Running in the Family",
                    author: "Michael Ondaatje",
                    genre: "Memoir",
                    availableCopies: 4,
                    publishedDate: new Date("1982-01-01"),
                },
            ]);
        }
        const genericReader = yield Reader_1.ReaderModel.findOne({ email: "john.doe@example.com" });
        if (genericReader) {
            yield Reader_1.ReaderModel.deleteMany({ email: { $in: ["john.doe@example.com", "jane.smith@example.com"] } });
        }
        const readerCount = yield Reader_1.ReaderModel.countDocuments();
        if (readerCount === 0) {
            yield Reader_1.ReaderModel.insertMany([
                {
                    name: "Kasun Perera",
                    email: "kasun.perera@ceylonshelf.lk",
                    phoneNumber: "+94 77 123 4567",
                    address: "No. 45, Galle Road, Colombo 03",
                    registerDate: new Date(),
                },
                {
                    name: "Dilhani Rajapaksha",
                    email: "dilhani.r@ceylonshelf.lk",
                    phoneNumber: "+94 71 987 6543",
                    address: "No. 12, Peradeniya Road, Kandy",
                    registerDate: new Date(),
                },
                {
                    name: "Pathum Nissanka",
                    email: "pathum.nissanka@ceylonshelf.lk",
                    phoneNumber: "+94 75 345 6789",
                    address: "No. 88, Main Street, Kurunegala",
                    registerDate: new Date(),
                },
                {
                    name: "Tharushi Fernando",
                    email: "tharushi.fernando@ceylonshelf.lk",
                    phoneNumber: "+94 76 567 8901",
                    address: "No. 24, Beach Road, Galle",
                    registerDate: new Date(),
                },
            ]);
        }
    }
    catch (seedErr) {
        console.error("Error during initial data seeding:", seedErr);
    }
});
