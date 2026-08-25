"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const readerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    registerDate: { type: Date, default: Date.now },
});
exports.ReaderModel = mongoose_1.default.model("Reader", readerSchema);
