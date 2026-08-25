import mongoose from "mongoose";

const lendingSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookTitle: { type: String, required: true },
    readerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reader', required: true },
    readerName: { type: String, required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
}, {
    timestamps: true
});

export const LendingModel = mongoose.model("Lending", lendingSchema);
