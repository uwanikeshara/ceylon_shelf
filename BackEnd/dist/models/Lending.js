"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lendingSchema = new mongoose_1.default.Schema({
    bookId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookTitle: { type: String, required: true },
    readerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Reader', required: true },
    readerName: { type: String, required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
}, {
    timestamps: true
});
exports.LendingModel = mongoose_1.default.model("Lending", lendingSchema);
