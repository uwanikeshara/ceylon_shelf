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
exports.getLendingCount = exports.getOverdueCount = exports.getOverdueLendings = exports.sendOverdueNotification = exports.getOverdueBooksByReader = exports.getLendingHistoryByReader = exports.getLendingHistoryByBook = exports.deleteLending = exports.updateLending = exports.getLendingById = exports.getLendings = exports.completeLending = exports.createLending = void 0;
const Lending_1 = require("../models/Lending");
const Book_1 = require("../models/Book");
const ApiError_1 = require("../errors/ApiError");
const Reader_1 = require("../models/Reader");
const mail_service_1 = __importDefault(require("../service/mail.service"));
const socket_1 = require("../socket");
const createLending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, readerId, dueDate, borrowDate, returnDate } = req.body;
        const book = yield Book_1.BookModel.findById(bookId);
        if (!book) {
            return next(new ApiError_1.APIError(404, "Book not found"));
        }
        const reader = yield Reader_1.ReaderModel.findById(readerId);
        if (!reader) {
            return next(new ApiError_1.APIError(404, "Reader not found"));
        }
        if (!returnDate) {
            if (book.availableCopies < 1) {
                return next(new ApiError_1.APIError(400, "No available copies for this book"));
            }
            book.availableCopies -= 1;
            yield book.save();
        }
        const calculatedBorrowDate = borrowDate ? new Date(borrowDate) : new Date();
        const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(calculatedBorrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        const calculatedReturnDate = returnDate ? new Date(returnDate) : undefined;
        const status = calculatedReturnDate ? "returned" : (calculatedDueDate < new Date() ? "overdue" : "borrowed");
        const lending = new Lending_1.LendingModel({
            bookId,
            readerId,
            bookTitle: book.title,
            readerName: reader.name,
            borrowDate: calculatedBorrowDate,
            dueDate: calculatedDueDate,
            returnDate: calculatedReturnDate,
            status,
        });
        yield lending.save();
        (0, socket_1.emitEvent)("lending_updated", { action: "create", lending });
        (0, socket_1.emitEvent)("book_updated", { action: "update", bookId: book._id });
        res.status(201).json(lending);
    }
    catch (error) {
        next(new ApiError_1.APIError(400, error.message));
    }
});
exports.createLending = createLending;
const completeLending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lending = yield Lending_1.LendingModel.findById(req.params.id);
        if (!lending)
            return next(new ApiError_1.APIError(404, "Lending not found"));
        if (lending.returnDate) {
            return next(new ApiError_1.APIError(400, "Lending already completed"));
        }
        const book = yield Book_1.BookModel.findById(lending.bookId);
        if (book) {
            book.availableCopies += 1;
            yield book.save();
        }
        lending.returnDate = req.body.returnDate ? new Date(req.body.returnDate) : new Date();
        lending.status = "returned";
        yield lending.save();
        (0, socket_1.emitEvent)("lending_updated", { action: "complete", lending });
        (0, socket_1.emitEvent)("book_updated", { action: "update", bookId: lending.bookId });
        res.json(lending);
    }
    catch (error) {
        next(new ApiError_1.APIError(400, error.message));
    }
});
exports.completeLending = completeLending;
const getLendings = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        yield Lending_1.LendingModel.updateMany({ dueDate: { $lt: now }, returnDate: null }, { $set: { status: "overdue" } });
        const lendings = yield Lending_1.LendingModel.find().sort({ _id: -1 });
        res.json(lendings);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getLendings = getLendings;
const getLendingById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lending = yield Lending_1.LendingModel.findById(req.params.id);
        if (!lending)
            return next(new ApiError_1.APIError(404, "Lending not found"));
        res.json(lending);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getLendingById = getLendingById;
const updateLending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lending = yield Lending_1.LendingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lending)
            return next(new ApiError_1.APIError(404, "Lending not found"));
        (0, socket_1.emitEvent)("lending_updated", { action: "update", lending });
        res.json(lending);
    }
    catch (error) {
        next(new ApiError_1.APIError(400, error.message));
    }
});
exports.updateLending = updateLending;
const deleteLending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lending = yield Lending_1.LendingModel.findById(req.params.id);
        if (!lending)
            return next(new ApiError_1.APIError(404, "Lending not found"));
        if (lending.status !== "returned") {
            const book = yield Book_1.BookModel.findById(lending.bookId);
            if (book) {
                book.availableCopies += 1;
                yield book.save();
            }
        }
        yield Lending_1.LendingModel.findByIdAndDelete(req.params.id);
        (0, socket_1.emitEvent)("lending_updated", { action: "delete", id: req.params.id });
        if (lending.bookId) {
            (0, socket_1.emitEvent)("book_updated", { action: "update", bookId: lending.bookId });
        }
        res.json({ message: "Lending deleted successfully" });
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.deleteLending = deleteLending;
const getLendingHistoryByBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lendings = yield Lending_1.LendingModel.find({ bookId: req.params.bookId });
        res.json(lendings);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getLendingHistoryByBook = getLendingHistoryByBook;
const getLendingHistoryByReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lendings = yield Lending_1.LendingModel.find({ readerId: req.params.readerId });
        res.json(lendings);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getLendingHistoryByReader = getLendingHistoryByReader;
const getOverdueBooksByReader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reader = yield Reader_1.ReaderModel.findById(req.params.readerId);
        if (!reader)
            return next(new ApiError_1.APIError(404, "Reader not found"));
        const now = new Date();
        yield Lending_1.LendingModel.updateMany({
            readerId: req.params.readerId,
            dueDate: { $lt: now },
            returnDate: null
        }, { $set: { status: "overdue" } });
        const overdueBooks = yield Lending_1.LendingModel.find({
            readerId: req.params.readerId,
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueBooks);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getOverdueBooksByReader = getOverdueBooksByReader;
const sendOverdueNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lendingId } = req.params;
        if (!lendingId) {
            return next(new ApiError_1.APIError(400, "Missing lendingId"));
        }
        const lending = yield Lending_1.LendingModel.findById(lendingId);
        if (!lending) {
            return next(new ApiError_1.APIError(404, "Lending not found"));
        }
        const reader = yield Reader_1.ReaderModel.findById(lending.readerId);
        if (!reader || !reader.email) {
            return next(new ApiError_1.APIError(404, "Reader or reader email not found"));
        }
        const subject = `Overdue Notice: Book "${lending.bookTitle}"`;
        const text = `Dear ${lending.readerName},\n\n` +
            `This is a courtesy notification that the book "${lending.bookTitle}"\n` +
            `issued to your CeylonShelf membership account is overdue.\n` +
            `Due Date: ${lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : "N/A"}\n\n` +
            `Please return the book to your nearest CeylonShelf branch at your earliest convenience to avoid fine accumulation.\n\n` +
            `Thank you,\nCeylonShelf Digital Library Network`;
        const mailResponse = yield mail_service_1.default.sendMail(reader.email, subject, text);
        res.status(200).json({ message: "Email sent successfully", response: mailResponse });
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.sendOverdueNotification = sendOverdueNotification;
const getOverdueLendings = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        yield Lending_1.LendingModel.updateMany({ dueDate: { $lt: now }, returnDate: null }, { $set: { status: "overdue" } });
        const overdueLendings = yield Lending_1.LendingModel.find({
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueLendings);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getOverdueLendings = getOverdueLendings;
const getOverdueCount = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const overdueCount = yield Lending_1.LendingModel.countDocuments({
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json({ overdueCount });
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getOverdueCount = getOverdueCount;
const getLendingCount = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Lending_1.LendingModel.countDocuments();
        res.json({ count });
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getLendingCount = getLendingCount;
