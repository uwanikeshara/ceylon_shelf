import { NextFunction, Request, Response } from "express";
import { BookModel } from "../models/Book";
import { APIError } from "../errors/ApiError";
import { emitEvent } from "../socket";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = new BookModel(req.body);
        await book.save();
        
        emitEvent("book_updated", { action: "create", book });
        
        res.status(201).json(book);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

export const getBooks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find().sort({ _id: -1 });
        res.json(books);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ error: "Book not found" });
        
        emitEvent("book_updated", { action: "update", book });

        res.json(book);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        
        emitEvent("book_updated", { action: "delete", id: req.params.id });

        res.json({ message: "Book deleted successfully" });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getBookCountWithoutCopies = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await BookModel.countDocuments({});
        res.status(200).json({ count });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get book count" });
    }
};

export const getBookCountWithCopies = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await BookModel.aggregate([
            { $group: { _id: null, total: { $sum: "$availableCopies" } } }
        ]);
        const total = result.length > 0 ? result[0].total : 0;
        res.status(200).json({ total });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get total available copies" });
    }
};