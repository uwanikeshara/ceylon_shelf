import { Request, Response, NextFunction } from "express";
import { LendingModel } from "../models/Lending";
import { BookModel } from "../models/Book"; 
import { APIError } from "../errors/ApiError"; 
import { ReaderModel } from "../models/Reader";
import sendMail from "../service/mail.service";
import { emitEvent } from "../socket";

export const createLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId, readerId, dueDate, borrowDate, returnDate } = req.body;

        const book = await BookModel.findById(bookId);
        if (!book) {
            return next(new APIError(404, "Book not found"));
        }

        const reader = await ReaderModel.findById(readerId);
        if (!reader) {
            return next(new APIError(404, "Reader not found"));
        }

        if (!returnDate) {
            if (book.availableCopies < 1) {
                return next(new APIError(400, "No available copies for this book"));
            }
            book.availableCopies -= 1;
            await book.save();
        }

        const calculatedBorrowDate = borrowDate ? new Date(borrowDate) : new Date();
        const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(calculatedBorrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        const calculatedReturnDate = returnDate ? new Date(returnDate) : undefined;
        const status = calculatedReturnDate ? "returned" : (calculatedDueDate < new Date() ? "overdue" : "borrowed");

        const lending = new LendingModel({
            bookId,
            readerId,
            bookTitle: book.title,
            readerName: reader.name,
            borrowDate: calculatedBorrowDate,
            dueDate: calculatedDueDate,
            returnDate: calculatedReturnDate,
            status,
        });

        await lending.save();

        emitEvent("lending_updated", { action: "create", lending });
        emitEvent("book_updated", { action: "update", bookId: book._id });

        res.status(201).json(lending);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

export const completeLending = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const lending = await LendingModel.findById(req.params.id);

        if (!lending) return next(new APIError(404, "Lending not found"));

        if (lending.returnDate) {
            return next(new APIError(400, "Lending already completed"));
        }

        const book = await BookModel.findById(lending.bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        lending.returnDate = req.body.returnDate ? new Date(req.body.returnDate) : new Date();
        lending.status = "returned";
        await lending.save();
        
        emitEvent("lending_updated", { action: "complete", lending });
        emitEvent("book_updated", { action: "update", bookId: lending.bookId });

        res.json(lending);

    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

export const getLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        await LendingModel.updateMany(
            { dueDate: { $lt: now }, returnDate: null },
            { $set: { status: "overdue" } }
        );
        const lendings = await LendingModel.find().sort({ _id: -1 });
        res.json(lendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getLendingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id);
        if (!lending) return next(new APIError(404, "Lending not found"));
        res.json(lending);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lending) return next(new APIError(404, "Lending not found"));
        
        emitEvent("lending_updated", { action: "update", lending });

        res.json(lending);
    } catch (error: any) {
        next(new APIError(400, error.message));
    }
};

export const deleteLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id);
        if (!lending) return next(new APIError(404, "Lending not found"));
        
        if (lending.status !== "returned") {
            const book = await BookModel.findById(lending.bookId);
            if (book) {
                book.availableCopies += 1;
                await book.save();
            }
        }

        await LendingModel.findByIdAndDelete(req.params.id);

        emitEvent("lending_updated", { action: "delete", id: req.params.id });
        if (lending.bookId) {
            emitEvent("book_updated", { action: "update", bookId: lending.bookId });
        }

        res.json({ message: "Lending deleted successfully" });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getLendingHistoryByBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ bookId: req.params.bookId });
        res.json(lendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getLendingHistoryByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lendings = await LendingModel.find({ readerId: req.params.readerId });
        res.json(lendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getOverdueBooksByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.readerId);
        if (!reader) return next(new APIError(404, "Reader not found"));
        const now = new Date();
        await LendingModel.updateMany(
            {
                readerId: req.params.readerId,
                dueDate: { $lt: now },
                returnDate: null
            },
            { $set: { status: "overdue" } }
        );
        const overdueBooks = await LendingModel.find({
            readerId: req.params.readerId,
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueBooks);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const sendOverdueNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lendingId } = req.params;
        if (!lendingId) {
            return next(new APIError(400, "Missing lendingId"));
        }

        const lending = await LendingModel.findById(lendingId);
        if (!lending) {
            return next(new APIError(404, "Lending not found"));
        }

        const reader = await ReaderModel.findById(lending.readerId);
        if (!reader || !reader.email) {
            return next(new APIError(404, "Reader or reader email not found"));
        }

        const subject = `Overdue Notice: Book "${lending.bookTitle}"`;
        const text = `Dear ${lending.readerName},\n\n` +
            `This is a courtesy notification that the book "${lending.bookTitle}"\n` +
            `issued to your CeylonShelf membership account is overdue.\n` +
            `Due Date: ${lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : "N/A"}\n\n` +
            `Please return the book to your nearest CeylonShelf branch at your earliest convenience to avoid fine accumulation.\n\n` +
            `Thank you,\nCeylonShelf Digital Library Network`;

        const mailResponse = await sendMail.sendMail(reader.email, subject, text);
        res.status(200).json({ message: "Email sent successfully", response: mailResponse });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getOverdueLendings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        await LendingModel.updateMany(
            { dueDate: { $lt: now }, returnDate: null },
            { $set: { status: "overdue" } }
        );
        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json(overdueLendings);
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getOverdueCount = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        const overdueCount = await LendingModel.countDocuments({
            dueDate: { $lt: now },
            returnDate: null
        });
        res.json({ overdueCount });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};

export const getLendingCount = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await LendingModel.countDocuments();
        res.json({ count });
    } catch (error: any) {
        next(new APIError(500, error.message));
    }
};
