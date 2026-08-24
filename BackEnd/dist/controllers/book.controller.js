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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookCountWithCopies = exports.getBookCountWithoutCopies = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const Book_1 = require("../models/Book");
const ApiError_1 = require("../errors/ApiError");
const socket_1 = require("../socket");
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = new Book_1.BookModel(req.body);
        yield book.save();
        (0, socket_1.emitEvent)("book_updated", { action: "create", book });
        res.status(201).json(book);
    }
    catch (error) {
        next(new ApiError_1.APIError(400, error.message));
    }
});
exports.createBook = createBook;
const getBooks = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.BookModel.find().sort({ _id: -1 });
        res.json(books);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getBooks = getBooks;
const getBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.BookModel.findById(req.params.id);
        if (!book)
            return res.status(404).json({ error: "Book not found" });
        res.json(book);
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book)
            return res.status(404).json({ error: "Book not found" });
        (0, socket_1.emitEvent)("book_updated", { action: "update", book });
        res.json(book);
    }
    catch (error) {
        next(new ApiError_1.APIError(400, error.message));
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.BookModel.findByIdAndDelete(req.params.id);
        if (!book)
            return res.status(404).json({ error: "Book not found" });
        (0, socket_1.emitEvent)("book_updated", { action: "delete", id: req.params.id });
        res.json({ message: "Book deleted successfully" });
    }
    catch (error) {
        next(new ApiError_1.APIError(500, error.message));
    }
});
exports.deleteBook = deleteBook;
const getBookCountWithoutCopies = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Book_1.BookModel.countDocuments({});
        res.status(200).json({ count });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to get book count" });
    }
});
exports.getBookCountWithoutCopies = getBookCountWithoutCopies;
const getBookCountWithCopies = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Book_1.BookModel.aggregate([
            { $group: { _id: null, total: { $sum: "$availableCopies" } } }
        ]);
        const total = result.length > 0 ? result[0].total : 0;
        res.status(200).json({ total });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to get total available copies" });
    }
});
exports.getBookCountWithCopies = getBookCountWithCopies;
