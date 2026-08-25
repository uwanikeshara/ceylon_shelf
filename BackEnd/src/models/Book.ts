import mongoose from "mongoose";

type Book = {
    title: string;
    author: string;
    publishedDate: Date;
    genre: string;
    availableCopies: number;
};

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    genre: { type: String, required: true },
    availableCopies: { type: Number, required: true, default: 0 },
});

export const BookModel = mongoose.model("Book", bookSchema);